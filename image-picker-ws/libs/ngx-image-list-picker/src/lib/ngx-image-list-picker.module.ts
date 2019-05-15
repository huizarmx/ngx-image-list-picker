import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxImageListPickerComponent } from './ngx-image-list-picker.component'
import { NgxFileListPickerComponent } from './ngx-file-list-picker.component'
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule
  ],
  declarations: [
    NgxImageListPickerComponent,
    NgxFileListPickerComponent
  ],
  exports: [
    NgxImageListPickerComponent,
    NgxFileListPickerComponent
  ]
})
export class NgxImageListPickerModule {}
