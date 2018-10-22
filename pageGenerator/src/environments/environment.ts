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

  currentConfig: 'externalBands',

  configurations: {
    // Array representing rows
    // Each row is an array, containing starting and ending index of a sequence of
    // static blocks, remaining blocks are assumed to be non static. Default static block type is text
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
    }
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
