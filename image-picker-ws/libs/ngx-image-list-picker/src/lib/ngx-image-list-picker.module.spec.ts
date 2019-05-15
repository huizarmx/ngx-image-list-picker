import { async, TestBed } from '@angular/core/testing';
import { NgxImageListPickerModule } from './ngx-image-list-picker.module';
import { NgxFileListPickerComponent } from './ngx-file-list-picker.component';

describe('NgxImageListPickerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxImageListPickerModule, NgxFileListPickerComponent]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxImageListPickerModule).toBeDefined();
  });
});
