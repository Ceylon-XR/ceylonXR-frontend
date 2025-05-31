# Campus Tour - SOGS Data Setup

## Directory Structure

The SOGS data files should be placed in the `data` directory with the following structure:

```
public/playcanvas/campus-tour/
├── index.html         # Main HTML file
├── sogs.js            # SOGS renderer
├── sogs-decoder.js    # SOGS decoder
└── data/              # Directory containing SOGS data files
    ├── meta.json      # SOGS metadata
    ├── means_l.png    # SOGS texture 1
    ├── means_u.png    # SOGS texture 2
    ├── quats.png      # SOGS texture 3
    ├── scales.png     # SOGS texture 4
    ├── sh0.png        # SOGS texture 5
    ├── opacities.png  # SOGS texture 6
    ├── shN_labels_l.png # SOGS texture 7
    └── shN_labels_u.png # SOGS texture 8
```

## Setup Instructions

1. Make sure all SOGS data files are placed in the `data` directory as shown above.
2. The main HTML file loads the SOGS data and displays the 3D campus tour.
3. Use WASD keys to move around and mouse to look around.
4. Press ESC to toggle mouse capture.
5. Hold SHIFT to move faster.

```

## Notes
- For viewing SOGS data, the browser must support WebGL 2.0.
- For best performance, use Chrome or Firefox.
```
