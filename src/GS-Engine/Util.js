import { AbortablePromise, AbortedPromiseError } from './AbortablePromise.js';

export const floatToHalf = (function() {

    const floatView = new Float32Array(1);
    const int32View = new Int32Array(floatView.buffer);

    return function(val) {
        floatView[0] = val;
        const x = int32View[0];

        let bits = (x >> 16) & 0x8000;
        let m = (x >> 12) & 0x07ff;
        const e = (x >> 23) & 0xff;

        if (e < 103) return bits;

        if (e > 142) {
            bits |= 0x7c00;
            bits |= ((e === 255) ? 0 : 1) && (x & 0x007fffff);
            return bits;
        }

        if (e < 113) {
            m |= 0x0800;
            bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
            return bits;
        }

        bits |= (( e - 112) << 10) | (m >> 1);
        bits += m & 1;
        return bits;
    };

})();

export const uintEncodedFloat = (function() {

    const floatView = new Float32Array(1);
    const int32View = new Int32Array(floatView.buffer);

    return function(f) {
        floatView[0] = f;
        return int32View[0];
    };

})();

export const rgbaToInteger = function(r, g, b, a) {
    return r + (g << 8) + (b << 16) + (a << 24);
};

export const rgbaArrayToInteger = function(arr, offset) {
    return arr[offset] + (arr[offset + 1] << 8) + (arr[offset + 2] << 16) + (arr[offset + 3] << 24);
};

export const fetchWithProgress = function(path, onProgress, saveChunks = true) {

    const abortController = new AbortController();
    const signal = abortController.signal;
    let aborted = false;
    let rejectFunc = null;
    
    const abortHandler = () => {
        if (!aborted) {
            abortController.abort();
            rejectFunc(new AbortedPromiseError('Fetch aborted.'));
            aborted = true;
        }
    };

    return new AbortablePromise((resolve, reject) => {
        rejectFunc = reject;

        fetch(path, { signal })
        .then(async (response) => {
            if (!response.ok) {
                reject(new Error(`Fetch error: ${response.statusText}`));
                return;
            }
            
            const reader = response.body.getReader();
            let bytesDownloaded = 0;
            let fileSize = parseInt(response.headers.get('Content-Length')) || undefined;
            const chunks = [];

            while (!aborted) {
                try {
                    const { value: chunk, done } = await reader.read();
                    if (done) {
                        if (onProgress) {
                            onProgress(100, '100%', chunk, fileSize);
                        }
                        if (saveChunks) {
                            const buffer = await new Blob(chunks).arrayBuffer();
                            resolve(buffer);
                        } else {
                            resolve();
                        }
                        break;
                    }
                    
                    bytesDownloaded += chunk.length;
                    let percent;
                    let percentLabel;
                    if (fileSize !== undefined) {
                        percent = (bytesDownloaded / fileSize) * 100;
                        percentLabel = `${percent.toFixed(2)}%`;
                    }
                    if (saveChunks) chunks.push(chunk);
                    if (onProgress) {
                        const cancelSaveChunks = onProgress(percent, percentLabel, chunk, fileSize);
                        if (cancelSaveChunks) saveChunks = false;
                    }
                } catch (error) {
                    reject(error);
                    break;
                }
            }
        })
        .catch(error => {
            if (!aborted) {
                reject(error);
            }
        });
    }, abortHandler);

};

export const clamp = function(val, min, max) {
    return Math.max(Math.min(val, max), min);
};

export const getCurrentTime = function() {
    return performance.now() / 1000;
};

export const disposeAllMeshes = (object3D) => {
    if (object3D.geometry) {
        object3D.geometry.dispose();
        object3D.geometry = null;
    }
    if (object3D.material) {
        object3D.material.dispose();
        object3D.material = null;
    }
    if (object3D.children) {
        for (let child of object3D.children) {
            disposeAllMeshes(child);
        }
    }
};

export const delayedExecute = (func, fast) => {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve(func());
        }, fast ? 1 : 50);
    });
};

export const getSphericalHarmonicsComponentCountForDegree = (sphericalHarmonicsDegree = 0) => {
    switch (sphericalHarmonicsDegree) {
        case 1:
            return 9;
        case 2:
            return 24;
        default:
            return 0;
    }
};

export const nativePromiseWithExtractedComponents = () => {
    let resolver;
    let rejecter;
    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    });
    return {
        'promise': promise,
        'resolve': resolver,
        'reject': rejecter
    };
};

export const abortablePromiseWithExtractedComponents = (abortHandler) => {
    let resolver;
    let rejecter;
    if (!abortHandler) {
        abortHandler = () => {};
    }
    const promise = new AbortablePromise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    }, abortHandler);
    return {
        'promise': promise,
        'resolve': resolver,
        'reject': rejecter
    };
};

class Semver {
    constructor(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    toString() {
        return `${this.major}_${this.minor}_${this.patch}`;
    }
}

export function isIOS() {
    const ua = navigator.userAgent;
    return ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0;
}

export function getIOSSemever() {
    if (isIOS()) {
        const extract = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        return new Semver(
            parseInt(extract[1] || 0, 10),
            parseInt(extract[2] || 0, 10),
            parseInt(extract[3] || 0, 10)
        );
    } else {
        return null; // or [0,0,0]
    }
}
