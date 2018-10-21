import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {BasicBlockConfig, PageConfiguration} from "./interfaces/page-configuration.interface";
import {BLOCK_TYPES} from "./constants/app.constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private currentConfiguration = environment.currentConfig;
  private pageCongifuration: PageConfiguration = environment.configurations[this.currentConfiguration];

  public baseBlockWidthPx: number;
  public fullScreenWidth: number;
  public baseBlockHeightPx: number;
  public BLOCK_TYPES = BLOCK_TYPES;

  // Each element represents the configuration of a block
  // Blocks are identified by incremental numbers starting from 0
  // up to a maximum of MAXBLOCK_PER_ROW*MAXBLOCK_PER_COLUMN-1 but we could have less block according to the configuration
  public rowsConfigurationArray = new Array();

  constructor() {
  }

  ngOnInit() {
    console.log('Window width:' + window.innerWidth);
    console.log('Window height:' + window.innerHeight);
    this.computeBlockDimensions();
  }

  private computeBlockDimensions(): void {
    this.fullScreenWidth = window.innerWidth;
    this.baseBlockWidthPx = Math.floor(window.innerWidth / environment.MAXBLOCK_PER_ROW);
    this.baseBlockHeightPx = Math.floor(window.innerHeight / environment.MAXBLOCK_PER_COLUMN);
    this.computeConfigurationArray()
    console.log('Base block width: ' + this.baseBlockWidthPx);
    console.log('Base block eight: ' + this.baseBlockHeightPx);
  }


  private computeConfigurationArray() {
    // Create block with different span dimension for each row
    for (let rowIndex = 0; rowIndex < environment.MAXBLOCK_PER_COLUMN; rowIndex++) {
      const rowStructure = this.pageCongifuration.structure[rowIndex];

      const rowBlocks = new Array<BasicBlockConfig>();
      let lastProcessedIndex = 0;

      for (const sequence of rowStructure) {
        // Pushing non static blocks
        if (lastProcessedIndex !== sequence.start) {
          rowBlocks.push({
            span: (sequence.start - lastProcessedIndex) * this.baseBlockWidthPx + 'px',
            blockType: BLOCK_TYPES.DYNAMIC,
          });
        }
        rowBlocks.push({
          span: (sequence.end - sequence.start) * this.baseBlockWidthPx + 'px',
          blockType: sequence.staticBlockType ? sequence.staticBlockType : BLOCK_TYPES.STATIC.TEXT,
          resourceReference: sequence.resourceReference ? sequence.resourceReference : null,
        });
        lastProcessedIndex = sequence.end;
      }
      // Pushing eventual border non static block
      if (lastProcessedIndex !== environment.MAXBLOCK_PER_ROW) {
        rowBlocks.push({
          span: (environment.MAXBLOCK_PER_ROW - lastProcessedIndex) * this.baseBlockWidthPx + 'px',
          blockType: BLOCK_TYPES.DYNAMIC
        });
      }

      this.rowsConfigurationArray.push(rowBlocks);
      console.log(rowBlocks);
    }

  }
}
