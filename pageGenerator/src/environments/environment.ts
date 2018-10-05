// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  MAXBLOCK_PER_ROW: 24,
  MAXBLOCK_PER_COLUMN: 10,

  currentConfig: 'externalBands',

  configurations: {
    // Array representing rows
    // Each row is an array, containing starting and ending index of a sequence of
    // static blocks, remaining blocks are assumed to be non static. Default static block type is text
    externalBands: {
      structure: [
        [],
        [{start: 4, end: 20, staticBlockType: 'static-title'}],
        [{start: 4, end: 20, staticBlockType: 'static-sub-title'}],
        [{start: 4, end: 20, staticBlockType: 'static-img', resourceReference: '0.jpg'}],
        [{start: 4, end: 20}],
        [{start: 4, end: 20}],
        [{start: 4, end: 20}],
        [{start: 4, end: 20}],
        [{start: 4, end: 20, staticBlockType: 'static-video'}],
        [{start: 4, end: 20}],
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
