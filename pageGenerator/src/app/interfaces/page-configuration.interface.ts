export interface PageConfiguration {
  structure: Array< // Array of rows
    Array< // Array of block sequences with starting and ending index
      StaticBlockSchema>>;
};

export interface StaticBlockSchema {
  start: number;
  end: number;
  staticBlockType?: string;
  resourceReference?: string;
}

export interface BasicBlockConfig {
  span: string; // Css width property value as string, injected in the component
  blockType: string; // Allows to characterize a block as static (of a certain type) or dynamic
  resourceReference?: string;
}
