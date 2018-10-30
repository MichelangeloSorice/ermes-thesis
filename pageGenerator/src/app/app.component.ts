import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {BasicBlockConfig, StaticBlockSchema} from "./interfaces/page-configuration.interface";
import {BLOCK_TYPES} from "./constants/app.constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private currentConfiguration = environment.currentConfig;
  // up to a maximum of MAXBLOCK_PER_ROW*MAXBLOCK_PER_COLUMN-1 but we could have less block according to the configuration
  public blocksConfigurationsArray = new Array();

  public baseBlockWidthPx: number;
  public fullScreenWidth: number;
  public baseBlockHeightPx: number;
  public BLOCK_TYPES = BLOCK_TYPES;

  // Each element represents the configuration of a block
  // Blocks are identified by incremental numbers starting from 0
  public availableBlocksMap;
  private pageCongifuration: Array<StaticBlockSchema> = environment.configurations[this.currentConfiguration].structure;

  constructor() {
    // This map will record available position to help signaling eventual errors in the configuration array
    this.availableBlocksMap = new Array();
    for (let y = 0; y < environment.MAXBLOCK_PER_COLUMN; y++) {
      this.availableBlocksMap.push(new Array(environment.MAXBLOCK_PER_ROW).fill(true));
    }
  }

  ngOnInit() {
    console.log('Window width:' + document.documentElement.clientWidth);
    console.log('Window height:' + document.documentElement.clientHeight);
    this.configurePageStructure();
  }

  private configurePageStructure(): void {
    this.fullScreenWidth = document.documentElement.clientWidth;
    this.baseBlockWidthPx = environment.baseBlockWidthPx;
    this.baseBlockHeightPx = environment.baseBlockHeightPx;
    if (this.fullScreenWidth < environment.MAXBLOCK_PER_ROW * this.baseBlockWidthPx) {
      console.log('Error the proposed configuration can not be adapted to current viewPort!');
    }
    this.computeConfigurationArray();
    this.fillMissingSpaces();
    console.log('Base block width: ' + this.baseBlockWidthPx);
    console.log('Base block eight: ' + this.baseBlockHeightPx);
  }


  private computeConfigurationArray() {
    // Create block with different span dimension for each row
    for (let x = 0; x < this.pageCongifuration.length; x++) {
      const block: StaticBlockSchema = this.pageCongifuration[x];
      if (!this.checkAvailabilityAndUpdateMap(block)) {
        console.log('Invalid configuration: provided config contains overlapping blocks.');
        console.log(block);
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

    // Evaluate the configuration to provide feedback about unused space
    this.evaluateConfig();
  }


  private checkAvailabilityAndUpdateMap(block: StaticBlockSchema): boolean {
    for (let y = block.ySpan[0]; y < block.ySpan[1]; y++) {
      for (let x = block.xSpan[0]; x < block.xSpan[1]; x++) {
        if (this.availableBlocksMap[y][x]) this.availableBlocksMap[y][x] = false;
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
            width: this.baseBlockWidthPx,
            height: this.baseBlockHeightPx,
            top: x * this.baseBlockHeightPx,
            left: y * this.baseBlockWidthPx,
            blockType: BLOCK_TYPES.STATIC.PLACEHOLDER,
          }
        );
      }
    }
  }

  private evaluateConfig() {
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

}
