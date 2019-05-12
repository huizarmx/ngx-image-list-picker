import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IImageDefinition } from '..';

@Component({
  selector: 'ngx-image-list-picker',
  templateUrl: './ngx-image-list-picker.template.html'
})
export class NgxImageListPickerComponent {

  /** The collection of images to display in the component */
  private _images = new Array<IImageDefinition>();

  /** The images grouped as needed to be displayed on screen */
  private _groupedImages = new Array<Array<IImageDefinition>>();

  /** The number of columns to present to the user */
  private _numberOfColumns = 6;

  /** The number of rows to present to the user */
  private _numberOfRows = 3;

  /** The number to use as width in terms of the bootstrap grid system */
  private _columnWidthBootstrapGrid = 2;

  /** The size of the page of images to present to the user at the same time */
  private _pageSize = 18;

  /** The current page of images being presented to the user */
  private _currentPage = 1;

  /** The number of pages available given the current collection of images */
  private _totalPages = 1;

  /** The total number of images contained in the collection of images */
  private _totalImages = 1;

  /** The image being previewed by the user */
  private _imagePreviewed: IImageDefinition = null;

  /** Will be triggered when the user picks an image from the list */
  @Output()
  public imageSelected= new EventEmitter<IImageDefinition>();

  /**
   * The collection of images to display in the component
   */
  @Input()
  get images(): Array<IImageDefinition> {
    return this.images;
  }

  /**
   * Sets the collection of images to display in the component.
   *
   * @param images the collection of images to display in the component.
   */
  set images(images: Array<IImageDefinition>) {
    if(!images || images === null || !images.length) {
      images = new Array<IImageDefinition>();
    }

    this._images = images;
    this._currentPage = 1;
    this._groupedImages = this.groupImages(this.paginate(this._currentPage), this._numberOfColumns);
  }

  /**
   * The number of columns to present in the component. It must be a number between 1 and 12. Default value is 6. If the value is outside the expected range, the default value will be used.
   */
  @Input()
  set numberOfColumns(numberOfColumns: number) {
    if(!numberOfColumns || isNaN(numberOfColumns) || numberOfColumns < 0 || numberOfColumns > 12) {
      numberOfColumns = 6;
    }
    this._numberOfColumns = numberOfColumns;
    this._columnWidthBootstrapGrid = 12 / this._numberOfColumns;
    this._pageSize = this._numberOfRows * this._numberOfColumns;
    this._currentPage = 1;
    this._groupedImages = this.groupImages(this.paginate(this._currentPage), this._numberOfColumns);
  }

  /**
   * The number of rows to present in the component. It must be a number greater than 0. If the number is not valid, 3 will be used as the default value.
   */
  @Input()
  set numberOfRows(numberOfRows: number) {
    if(!numberOfRows || isNaN(numberOfRows) || numberOfRows < 1) {
      numberOfRows = 3;
    }
    this._numberOfRows = numberOfRows;
    this._pageSize = numberOfRows * this._numberOfColumns;
    this._currentPage = 1;
    this._groupedImages = this.groupImages(this.paginate(this._currentPage), this._numberOfColumns);
  }

  /**
   * Handler of the click event for every element in the list of files
   *
   * @param image the image selected for preview
   */
  private onPreviewImage(image: IImageDefinition) {
    this._imagePreviewed = image;
  }

  /**
   * Handler of the click event for the select button on the list of images
   *
   * @param image the image that was selected by the user
   */
  private onImageSelected(image: IImageDefinition) {
    this.imageSelected.emit(image);
  }

  /**
   * Gets the filename of a url
   *
   * @param url the url to review
   */
  private getFileName(url: string): string {
    return url.substring(url.lastIndexOf('/')+1);
  }

  /**
   * Gets the requested number of page from the curren collection of images.
   *
   * @param page_number the number of page to get
   * @returns a section of the collection that corresponds to the request number of page.
   */
  private paginate(page_number: number): Array<IImageDefinition> {
    this._totalImages = this._images.length;
    this._totalPages = Math.ceil(this._totalImages / this._pageSize);
    if(page_number < 1 || page_number > this._totalPages) {
      page_number = 1;
    }
    return this._images.slice((page_number - 1) * this._pageSize, page_number * this._pageSize);
  }

  /**
   * Groups the images every n items to create the structure needed to render the images on screen.
   *
   * @param data the images source array to group
   * @param n the number of elements that every group must have
   * @returns an array of groups which have n elements at most each.
   */
  private groupImages<T>(data: Array<T>, n: number): Array<T[]> {
    const group = new Array<T[]>();
    for (let y = 0; y < data.length % n; y++) {
      data.push(null);
    }
    for (let i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(data[i])
    }
    return group;
  }
}
