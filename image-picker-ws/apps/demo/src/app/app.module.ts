import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxImageListPickerModule } from '@image-picker-ws/ngx-image-list-picker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxImageListPickerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
