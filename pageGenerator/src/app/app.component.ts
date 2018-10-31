import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {BasicBlockConfig, StaticBlockSchema, TestCaseSummary} from "./interfaces/page-configuration.interface";
import {BLOCK_TYPES} from "./constants/app.constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private currentConfiguration = environment.currentConfig;
  // up to a maximum of MAXBLOCK_PER_ROW*MAXBLOCK_PER_COLUMN-1 but we could have less block according to the configuration


  public baseBlockWidthPx: number;
  public fullScreenWidth: number;
  public baseBlockHeightPx: number;

  // Map representing our 'grid' keeping track of which blocks are available and which have already been used
  public availableBlocksMap: Array<Array<boolean>>;
  // Array summarizing which blocks in the current configuration are dynamic for test sake
  public dynamicBlocksSummary: Array<boolean>;
  // Array computed from pageConfiguration containing the actual properties of the real blocks
  public blocksConfigurationsArray: Array<BasicBlockConfig> = new Array();
  // Array of objects defining an abstract page configuration
  private pageCongifuration: Array<StaticBlockSchema> = environment.configurations[this.currentConfiguration].structure;

  constructor() {
  }


  /**
   * Initializes global objects defining page  configuration
   */
  ngOnInit() {
    this.initAvailableBlocksMap();
    this.initDynamicBlockSummary();
    this.configurePageStructure();
    this.computeTestData();
  }

  /**
   * Initializes the map creating a matrix with the grid dimensions. All elements are True meaning all
   * positions are available.
   */
  private initAvailableBlocksMap(): void {
    this.availableBlocksMap = new Array();
    for (let y = 0; y < environment.MAXBLOCK_PER_COLUMN; y++) {
      this.availableBlocksMap.push(new Array(environment.MAXBLOCK_PER_ROW).fill(true));
    }
  }

  /**
   * Initializes an array containing for each block of the grid a boolean value, true means that the block is dynamic,
   * at the beginning all blocks are assumed to be static
   */
  private initDynamicBlockSummary(): void {
    this.dynamicBlocksSummary = new Array(environment.MAXBLOCK_PER_COLUMN * environment.MAXBLOCK_PER_ROW).fill(false);
  }


  private configurePageStructure(): void {
    this.fullScreenWidth = document.documentElement.clientWidth;
    this.baseBlockWidthPx = environment.baseBlockWidthPx;
    this.baseBlockHeightPx = environment.baseBlockHeightPx;
    console.log('Screen width: ' + this.fullScreenWidth);
    console.log('Base block width: ' + this.baseBlockWidthPx);
    console.log('Base block eight: ' + this.baseBlockHeightPx);

    // Checking if there is enough space to dispose our blocks with the provided blocks sizes
    if (this.fullScreenWidth < environment.MAXBLOCK_PER_ROW * this.baseBlockWidthPx) {
      console.error('Error the proposed configuration can not be adapted to current viewPort!');
      return;
    }

    this.computeConfigurationArray();
  }

  /**
   * Based on the provided configuration computes an array of BasicBlockConfig objects
   * To each BasicBlockConfig will correspond an instance of the BasicBlock component which will
   * be characterized in shape, position and type by its configuration
   */
  private computeConfigurationArray() {
    // Create block with different span dimension for each row
    for (let x = 0; x < this.pageCongifuration.length; x++) {
      const block: StaticBlockSchema = this.pageCongifuration[x];

      if (!this.validateAndTrackBlock(block)) {
        console.error('Invalid configuration: provided config contains overlapping blocks.');
        console.error(block);
        return;
      }

      const blockConfig: BasicBlockConfig = {
        width: this.baseBlockWidthPx * (block.xSpan[1] - block.xSpan[0]) + 'px',
        height: this.baseBlockHeightPx * (block.ySpan[1] - block.ySpan[0]) + 'px',
        top: this.baseBlockHeightPx * block.ySpan[0] + 'px',
        left: this.baseBlockWidthPx * block.xSpan[0] + 'px',
        blockType: block.blockType ? block.blockType : BLOCK_TYPES.DYNAMIC,
      }
      if (block.resourceReference) blockConfig.resourceReference = block.resourceReference;
      this.blocksConfigurationsArray.push(blockConfig);
      console.log(blockConfig);
    }

    this.fillMissingSpaces();
    // Evaluate the configuration to provide feedback about unused space
    this.evaluateConfig();
  }

  /**
   * Validates the satic block configuration provided by the environment variable, moreover it updates the
   * availableBlocksMap and the dynamicBlocksSummary
   * @param {StaticBlockSchema} block
   * @returns {boolean} true if the static configuration is valid
   */
  private validateAndTrackBlock(block: StaticBlockSchema): boolean {
    const isBlockDynamic = block.blockType ? false : true;

    // Checking if the block span properties are valid
    if (block.ySpan[0] > block.ySpan[1] || block.xSpan[0] > block.xSpan[1]) return false;

    // Checking if there is space in our grid to insert this new block
    for (let y = block.ySpan[0]; y < block.ySpan[1]; y++) {
      for (let x = block.xSpan[0]; x < block.xSpan[1]; x++) {
        if (this.availableBlocksMap[y][x]) {
          // Updating the map
          this.availableBlocksMap[y][x] = false;
          // Keeping track of any new dynamic block
          if (isBlockDynamic) this.dynamicBlocksSummary[y * environment.MAXBLOCK_PER_ROW + x] = true;
        }
        else return false;
      }
    }
    return true;
  }

  private fillMissingSpaces() {
    for (let y = 0; y < environment.MAXBLOCK_PER_COLUMN; y++) {
      for (let x = 0; x < environment.MAXBLOCK_PER_ROW; x++) {
        if (this.availableBlocksMap[y][x]) this.blocksConfigurationsArray.push(
          {
            width: this.baseBlockWidthPx + 'px',
            height: this.baseBlockHeightPx + 'px',
            top: x * this.baseBlockHeightPx + 'px',
            left: y * this.baseBlockWidthPx + 'px',
            blockType: BLOCK_TYPES.STATIC.PLACEHOLDER,
          }
        );
      }
    }
  }

  private evaluateConfig(): void {
    for (let y = 0; y < environment.MAXBLOCK_PER_COLUMN - 1; y++) {
      for (let x = 0; x < environment.MAXBLOCK_PER_ROW - 1; x++) {
        // If a block has not been used I expect that also blocks to its right or under it have not been used
        // In this way we will be sure that the created divs have fixed sizes and will dispose as we expect
        if (this.availableBlocksMap[y][x] && (!this.availableBlocksMap[y][x + 1] || !this.availableBlocksMap[y + 1][x])) {
          console.log('Warning: unbalanced configuration may lead to unexpected page layout, problems at [' +
            x + ',' + y + ']');
          return;
        }
      }
    }
  }

  /**
   * Prints a reminder of the executed test case used to evaluate results of dynamicSectionDetectionTool
   */
  private computeTestData(): void {
    const testCase: TestCaseSummary = {
      configuration: this.currentConfiguration,
      numCol: environment.MAXBLOCK_PER_ROW,
      numRows: environment.MAXBLOCK_PER_COLUMN,
      baseBlockHeight: this.baseBlockHeightPx,
      baseBlockWidth: this.baseBlockWidthPx,
      dynamicBlocksSummary: this.dynamicBlocksSummary,
    };
    console.log(JSON.stringify(testCase));
  }

}
