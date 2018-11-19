// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // This will keep the same ratio of screenshots made with Browsertime (1920x1080)
  MAXBLOCK_PER_ROW: 192,
  MAXBLOCK_PER_COLUMN: 108,

  baseBlockWidthPx: 10,
  baseBlockHeightPx: 10,

  currentConfig: 'isolatedBanners',

  configurations: {
    // The structure array contains the blocks of our application as showed on screen
    // Default block type is dynamic, xSpan and ySpan define which subBlocks of the grid belong to the block
    externalBands: {
      structure: [
        {xSpan: [0, 192], ySpan: [0, 16]},
        {xSpan: [0, 24], ySpan: [16, 42]}, {
          xSpan: [24, 168],
          ySpan: [16, 26],
          blockType: 'static-title'
        }, {xSpan: [168, 192], ySpan: [16, 42]},
        {xSpan: [0, 24], ySpan: [42, 68]}, {
          xSpan: [24, 168],
          ySpan: [26, 32],
          blockType: 'static-sub-title'
        }, {xSpan: [168, 192], ySpan: [42, 68]},
        {xSpan: [0, 24], ySpan: [68, 108]}, {
          xSpan: [24, 168],
          ySpan: [32, 50],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        }, {xSpan: [168, 192], ySpan: [68, 108]},
        {xSpan: [24, 168], ySpan: [50, 108], blockType: 'static-text'}
      ]
    },
    repubblica: {
      structure: [
        {xSpan: [0, 192], ySpan: [0, 16]}, {xSpan: [0, 24], ySpan: [16, 42]},
        {
          xSpan: [24, 168],
          ySpan: [16, 26],
          blockType: 'static-title'
        },
        {xSpan: [168, 192], ySpan: [16, 42]}, {xSpan: [0, 24], ySpan: [42, 68]}, {xSpan: [27, 165], ySpan: [28, 34]},
        {
          xSpan: [24, 168],
          ySpan: [34, 56],
          blockType: 'static-sub-title'
        },
        {xSpan: [168, 192], ySpan: [42, 68]}, {xSpan: [0, 24], ySpan: [68, 108]},
        {
          xSpan: [24, 168],
          ySpan: [56, 68],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        },
        {xSpan: [168, 192], ySpan: [68, 108]},
        {
          xSpan: [24, 168],
          ySpan: [68, 108],
          blockType: 'static-text'
        }
      ]
    },
    isolatedBanners: {
      structure: [
        {xSpan: [41, 151], ySpan: [3, 19]},
        {xSpan: [10, 31], ySpan: [21, 42]},
        {
          xSpan: [33, 159],
          ySpan: [21, 29],
          blockType: 'static-title'
        },
        {
          xSpan: [33, 159],
          ySpan: [30, 34],
          blockType: 'static-sub-title'
        },
        {
          xSpan: [35, 75],
          ySpan: [36, 48],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        },
        {
          xSpan: [117, 157],
          ySpan: [36, 48],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        },
        {
          xSpan: [33, 159],
          ySpan: [50, 89],
          blockType: 'static-text'
        },
        {xSpan: [161, 182], ySpan: [21, 42]},
        {xSpan: [10, 31], ySpan: [50, 78]}, {xSpan: [161, 182], ySpan: [50, 78]},
        {xSpan: [31, 161], ySpan: [90, 101]},
      ]
    },
    asymmetricBanners: {
      structure: [
        {xSpan: [2, 23], ySpan: [0, 108]},
        {xSpan: [169, 190], ySpan: [0, 108]},
        {xSpan: [23, 169], ySpan: [0, 12]},
        {
          xSpan: [33, 169],
          ySpan: [12, 24],
          blockType: 'static-title'
        },
        {
          xSpan: [33, 123],
          ySpan: [25, 30],
          blockType: 'static-sub-title'
        },
        {xSpan: [123, 168], ySpan: [25, 36]},
        {
          xSpan: [123, 168],
          ySpan: [37, 49],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        },
        {
          xSpan: [33, 123],
          ySpan: [32, 49],
          blockType: 'static-img',
          resourceReference: '0.jpg'
        },
        {
          xSpan: [33, 168],
          ySpan: [50, 65],
          blockType: 'static-text'
        },
        {xSpan: [123, 168], ySpan: [65, 108]},
        {
          xSpan: [33, 122],
          ySpan: [65, 108],
          blockType: 'static-text'
        },
      ]
    },
    mainlyDynamic: {
      structure: [
        {xSpan: [12, 180], ySpan: [3, 18]},
        {
          xSpan: [14, 155],
          ySpan: [20, 30],
          blockType: 'static-title'
        },
        {xSpan: [159, 182], ySpan: [20, 100]},
        {xSpan: [14, 158], ySpan: [32, 45]},
        {
          xSpan: [14, 155],
          ySpan: [46, 50],
          blockType: 'static-sub-title'
        },
        {xSpan: [14, 158], ySpan: [51, 61]},
        {
          xSpan: [14, 155],
          ySpan: [62, 72],
          blockType: 'static-text'
        },
        {xSpan: [14, 158], ySpan: [74, 88]},
      ]
    },
  }


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
