// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // This will keep the same ratio of screenshots made with Browsertime (1920x1080)
  MAXBLOCK_PER_ROW: 192,
  MAXBLOCK_PER_COLUMN: 108,

  baseBlockWidthPx: 10,
  baseBlockHeightPx: 10,

  currentConfig: 'isolatedBanners',

  configurations: {
    // The structure array contains the blocks of our application as showed on screen
    // Default block type is dynamic, xSpan and ySpan define which subBlocks of the grid belong to the block
    androidWorldTpl0: {
      structure: [
        {xSpan: [59, 131], ySpan: [0, 9]},
        {xSpan: [117, 153], ySpan: [104, 108]}
      ]
    },
    androidWorldTpl1: {
      structure: [
        {xSpan: [47, 144], ySpan: [0, 25]},
      ]
    },
    meteoTpl0: {
      structure: [
        {xSpan: [0, 46], ySpan: [0, 108]},
        {xSpan: [145, 190], ySpan: [0, 108]},
        {xSpan: [46, 145], ySpan: [0, 9]},
      ]
    },
    meteoTpl1: {
      structure: []
    },
    sole24oreTpl0: {
      structure: [
        {xSpan: [0, 35], ySpan: [0, 108]},
        {xSpan: [155, 191], ySpan: [0, 108]},
        {xSpan: [35, 155], ySpan: [0, 12]},
        {xSpan: [38, 57], ySpan: [18, 27]},
        {xSpan: [134, 153], ySpan: [18, 27]},
        {xSpan: [122, 152], ySpan: [43, 68]},
      ]
    },
    sole24oreTpl2: {
      structure: []
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
