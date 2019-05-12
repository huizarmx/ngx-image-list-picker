import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxImageListPickerComponent} from './ngx-image-list-picker.component'
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule
  ],
  declarations: [
    NgxImageListPickerComponent
  ],
  exports: [
    NgxImageListPickerComponent
  ]
})
export class NgxImageListPickerModule {}
