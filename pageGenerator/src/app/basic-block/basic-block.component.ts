import {Component, Input, OnInit} from '@angular/core';
import {ADVERTS_BASE_DIR, BLOCK_TYPES, STATIC_IMGS_BASE_DIR} from "../constants/app.constants";
import {BasicBlockConfig} from "../interfaces/page-configuration.interface";

@Component({
  selector: 'basic-block',
  templateUrl: './basic-block.component.html',
  styleUrls: ['./basic-block.component.css']
})
export class BasicBlockComponent implements OnInit {
  @Input() blockConfig: BasicBlockConfig = null;
  @Input() baseBlockWidth: number = null;
  @Input() baseBlockHeight: number = null;

  public BLOCK_TYPES = BLOCK_TYPES;
  public imgResource: string = null;


  constructor() {
  }

  ngOnInit() {
    if (this.blockConfig.blockType === this.BLOCK_TYPES.DYNAMIC)
      this.imgResource = ADVERTS_BASE_DIR + this.getRandomInt(0, 11) + '.jpg';
    if (this.blockConfig.blockType === this.BLOCK_TYPES.STATIC.IMG)
      this.imgResource = this.blockConfig.resourceReference ?
        STATIC_IMGS_BASE_DIR + this.blockConfig.resourceReference : STATIC_IMGS_BASE_DIR + 'default.jpg';
  }


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
  }
}
