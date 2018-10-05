import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BasicBlockComponent} from './basic-block/basic-block.component';
import {NgxLoremIpsumModule} from "ngx-lorem-ipsum/lib/ngx-lorem-ipsum.module";

@NgModule({
  declarations: [
    AppComponent,
    BasicBlockComponent,

  ],
  imports: [
    BrowserModule,
    NgxLoremIpsumModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
