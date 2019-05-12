import { async, TestBed } from '@angular/core/testing';
import { NgxImageListPickerModule } from './ngx-image-list-picker.module';

describe('NgxImageListPickerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxImageListPickerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxImageListPickerModule).toBeDefined();
  });
});
