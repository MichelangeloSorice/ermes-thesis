export interface PageConfiguration {
  structure: StaticBlockSchema[]; // Array of block sequences with starting and ending index
};

export interface StaticBlockSchema {
  xSpan: number[];
  ySpan: number[];
  blockType?: string;
  resourceReference?: string;
}

export interface BasicBlockConfig {
  // Css properties directly injected to the div containing the block
  // Exploits absolute positioning and fixed size to be sure that the output layout mirrors what we expect
  width: string;
  height: string;
  top: string;
  left: string;
  blockType: string; // Allows to characterize a block as static (of a certain type) or dynamic
  resourceReference?: string;
}

export interface TestCaseSummary {
  configuration: string;
  numRows: number;
  numCol: number;
  baseBlockHeight: number;
  baseBlockwidth: number;
  dynamicBlocksSummary: Array<boolean>;
}
