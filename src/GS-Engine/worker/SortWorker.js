import { isIOS, getIOSSemever } from '../Util.js';
import { Constants } from '../Constants.js';

function sortWorker(self) {
    let wasmInstance;
    let wasmMemory;
    let useSharedMemory;
    let integerBasedSort;
    let dynamicMode;
    let splatCount;
    let indexesToSortOffset;
    let sortedIndexesOffset;
    let sceneIndexesOffset;
    let transformsOffset;
    let precomputedDistancesOffset;
    let mappedDistancesOffset;
    let frequenciesOffset;
    let centersOffset;
    let modelViewProjOffset;
    let countsZero;
    let sortedIndexesOut;

    let Constants;

    // Declare centers and sceneIndexes here
    let centers;
    let sceneIndexes;

    function sort(splatSortCount, splatRenderCount, modelViewProj,
                  usePrecomputedDistances, copyIndexesToSort, copyPrecomputedDistances, copyTransforms) {
        const sortStartTime = performance.now();

        if (!useSharedMemory) {
            const indexesToSort = new Uint32Array(wasmMemory, indexesToSortOffset, copyIndexesToSort.byteLength / Constants.BytesPerInt);
            indexesToSort.set(copyIndexesToSort);
            const transforms = new Float32Array(wasmMemory, transformsOffset, copyTransforms.byteLength / Constants.BytesPerFloat);
            transforms.set(copyTransforms);
            if (usePrecomputedDistances) {
                let precomputedDistances;
                if (integerBasedSort) {
                    precomputedDistances = new Int32Array(wasmMemory, precomputedDistancesOffset,
                                                          copyPrecomputedDistances.byteLength / Constants.BytesPerInt);
                } else {
                    precomputedDistances = new Float32Array(wasmMemory, precomputedDistancesOffset,
                                                            copyPrecomputedDistances.byteLength / Constants.BytesPerFloat);
                }
                precomputedDistances.set(copyPrecomputedDistances);
            }
        }

        if (!countsZero) countsZero = new Uint32Array(Constants.DepthMapRange);
        new Float32Array(wasmMemory, modelViewProjOffset, 16).set(modelViewProj);
        new Uint32Array(wasmMemory, frequenciesOffset, Constants.DepthMapRange).set(countsZero);
        wasmInstance.exports.sortIndexes(indexesToSortOffset, centersOffset, precomputedDistancesOffset,
                                         mappedDistancesOffset, frequenciesOffset, modelViewProjOffset,
                                         sortedIndexesOffset, sceneIndexesOffset, transformsOffset, Constants.DepthMapRange,
                                         splatSortCount, splatRenderCount, splatCount, usePrecomputedDistances, integerBasedSort,
                                         dynamicMode);

        const sortMessage = {
            'sortDone': true,
            'splatSortCount': splatSortCount,
            'splatRenderCount': splatRenderCount,
            'sortTime': 0
        };
        if (!useSharedMemory) {
            const sortedIndexes = new Uint32Array(wasmMemory, sortedIndexesOffset, splatRenderCount);
            if (!sortedIndexesOut || sortedIndexesOut.length < splatRenderCount) {
                sortedIndexesOut = new Uint32Array(splatRenderCount);
            }
            sortedIndexesOut.set(sortedIndexes);
            sortMessage.sortedIndexes = sortedIndexesOut;
        }
        const sortEndTime = performance.now();

        sortMessage.sortTime = sortEndTime - sortStartTime;

        self.postMessage(sortMessage);
    }

    self.onmessage = (e) => {
        if (e.data.centers) {
            centers = e.data.centers;
            sceneIndexes = e.data.sceneIndexes;
            if (integerBasedSort) {
                new Int32Array(wasmMemory, centersOffset + e.data.range.from * Constants.BytesPerInt * 4,
                               e.data.range.count * 4).set(new Int32Array(centers));
            } else {
                new Float32Array(wasmMemory, centersOffset + e.data.range.from * Constants.BytesPerFloat * 4,
                                 e.data.range.count * 4).set(new Float32Array(centers));
            }
            if (dynamicMode) {
                new Uint32Array(wasmMemory, sceneIndexesOffset + e.data.range.from * 4,
                                e.data.range.count).set(new Uint32Array(sceneIndexes));
            }
            self.postMessage({
                'centerDataSet': true,
            });
        } else if (e.data.sort) {
            const renderCount = e.data.sort.splatRenderCount || 0;
            const sortCount = e.data.sort.splatSortCount || 0;
            const usePrecomputedDistances = e.data.sort.usePrecomputedDistances;

            let copyIndexesToSort;
            let copyPrecomputedDistances;
            let copyTransforms;
            if (!useSharedMemory) {
                copyIndexesToSort = e.data.sort.indexesToSort;
                copyTransforms = e.data.sort.transforms;
                if (usePrecomputedDistances) copyPrecomputedDistances = e.data.sort.precomputedDistances;
            }
            sort(sortCount, renderCount, e.data.sort.modelViewProj, usePrecomputedDistances,
                 copyIndexesToSort, copyPrecomputedDistances, copyTransforms);
        } else if (e.data.init) {
            // Yep, this is super hacky and gross :(
            Constants = e.data.init.Constants;

            splatCount = e.data.init.splatCount;
            useSharedMemory = e.data.init.useSharedMemory;
            integerBasedSort = e.data.init.integerBasedSort;
            dynamicMode = e.data.init.dynamicMode;

            const CENTERS_BYTES_PER_ENTRY = integerBasedSort ? (Constants.BytesPerInt * 4) : (Constants.BytesPerFloat * 4);

            const sorterWasmBytes = new Uint8Array(e.data.init.sorterWasmBytes);

            const matrixSize = 16 * Constants.BytesPerFloat;
            const memoryRequiredForIndexesToSort = splatCount * Constants.BytesPerInt;
            const memoryRequiredForCenters = splatCount * CENTERS_BYTES_PER_ENTRY;
            const memoryRequiredForModelViewProjectionMatrix = matrixSize;
            const memoryRequiredForPrecomputedDistances = integerBasedSort ?
                                                          (splatCount * Constants.BytesPerInt) : (splatCount * Constants.BytesPerFloat);
            const memoryRequiredForMappedDistances = splatCount * Constants.BytesPerInt;
            const memoryRequiredForSortedIndexes = splatCount * Constants.BytesPerInt;
            const memoryRequiredForIntermediateSortBuffers = Constants.DepthMapRange * Constants.BytesPerInt * 2;
            const memoryRequiredforTransformIndexes = dynamicMode ? (splatCount * Constants.BytesPerInt) : 0;
            const memoryRequiredforTransforms = dynamicMode ? (Constants.MaxScenes * matrixSize) : 0;
            const extraMemory = Constants.MemoryPageSize * 32;

            const totalRequiredMemory = memoryRequiredForIndexesToSort +
                                        memoryRequiredForCenters +
                                        memoryRequiredForModelViewProjectionMatrix +
                                        memoryRequiredForPrecomputedDistances +
                                        memoryRequiredForMappedDistances +
                                        memoryRequiredForIntermediateSortBuffers +
                                        memoryRequiredForSortedIndexes +
                                        memoryRequiredforTransformIndexes +
                                        memoryRequiredforTransforms +
                                        extraMemory;
            const totalPagesRequired = Math.floor(totalRequiredMemory / Constants.MemoryPageSize ) + 1;
            const sorterWasmImport = {
                module: {},
                env: {
                    memory: new WebAssembly.Memory({
                        initial: totalPagesRequired,
                        maximum: totalPagesRequired,
                        shared: true,
                    }),
                }
            };
            WebAssembly.compile(sorterWasmBytes)
            .then((wasmModule) => {
                return WebAssembly.instantiate(wasmModule, sorterWasmImport);
            })
            .then((instance) => {
                wasmInstance = instance;
                indexesToSortOffset = 0;
                centersOffset = indexesToSortOffset + memoryRequiredForIndexesToSort;
                modelViewProjOffset = centersOffset + memoryRequiredForCenters;
                precomputedDistancesOffset = modelViewProjOffset + memoryRequiredForModelViewProjectionMatrix;
                mappedDistancesOffset = precomputedDistancesOffset + memoryRequiredForPrecomputedDistances;
                frequenciesOffset = mappedDistancesOffset + memoryRequiredForMappedDistances;
                sortedIndexesOffset = frequenciesOffset + memoryRequiredForIntermediateSortBuffers;
                sceneIndexesOffset = sortedIndexesOffset + memoryRequiredforTransformIndexes;
                transformsOffset = sceneIndexesOffset + memoryRequiredforTransforms;
                wasmMemory = sorterWasmImport.env.memory.buffer;
                if (useSharedMemory) {
                    self.postMessage({
                        'sortSetupPhase1Complete': true,
                        'indexesToSortBuffer': wasmMemory,
                        'indexesToSortOffset': indexesToSortOffset,
                        'sortedIndexesBuffer': wasmMemory,
                        'sortedIndexesOffset': sortedIndexesOffset,
                        'precomputedDistancesBuffer': wasmMemory,
                        'precomputedDistancesOffset': precomputedDistancesOffset,
                        'transformsBuffer': wasmMemory,
                        'transformsOffset': transformsOffset
                    });
                } else {
                    self.postMessage({
                        'sortSetupPhase1Complete': true
                    });
                }
            });
        }
    };
}
export function createSortWorker(splatCount, useSharedMemory, enableSIMDInSort, integerBasedSort, dynamicMode) {
    const worker = new Worker(
        URL.createObjectURL(
            new Blob(['(', sortWorker.toString(), ')(self)'], {
                type: 'application/javascript',
            }),
        ),
    );

    // Adjust the path to access WASM files from the public directory
    let sourceWasm = '/worker/sorter.wasm'; // Default path

    let iOSSemVer = isIOS() ? getIOSSemever() : null;
    if (!enableSIMDInSort && !useSharedMemory) {
        sourceWasm = '/worker/sorter_no_simd.wasm';
        if (iOSSemVer && iOSSemVer.major < 16) {
            sourceWasm = '/worker/sorter_no_simd_non_shared.wasm';
        }
    } else if (!enableSIMDInSort) {
        sourceWasm = '/worker/sorter_no_simd.wasm';
    } else if (!useSharedMemory) {
        if (iOSSemVer && iOSSemVer.major < 16) {
            sourceWasm = '/worker/sorter_non_shared.wasm';
        }
    }

    console.log("Fetching WASM from:", sourceWasm);

    // Fetch and convert the WASM file to Base64
    fetch(sourceWasm)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(wasmArrayBuffer => {
            console.log("WASM ArrayBuffer received:", wasmArrayBuffer);

            worker.postMessage({
                'init': {
                    'sorterWasmBytes': wasmArrayBuffer,
                    'splatCount': splatCount,
                    'useSharedMemory': useSharedMemory,
                    'integerBasedSort': integerBasedSort,
                    'dynamicMode': dynamicMode,
                    'Constants': {
                        'BytesPerFloat': Constants.BytesPerFloat,
                        'BytesPerInt': Constants.BytesPerInt,
                        'DepthMapRange': Constants.DepthMapRange,
                        'MemoryPageSize': Constants.MemoryPageSize,
                        'MaxScenes': Constants.MaxScenes
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching WASM file:', error);
        });

    return worker;
}
