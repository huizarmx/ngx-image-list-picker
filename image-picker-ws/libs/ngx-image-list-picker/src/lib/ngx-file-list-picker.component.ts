import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { IImageDefinition } from '..';
import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { IFileUploadOptions, IFileDefinition, IOperationResult } from './model';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-file-list-picker',
  templateUrl: './ngx-file-list-picker.template.html'
})
export class NgxFileListPickerComponent {

  /** The text filter to apply to the collection of images */
  public _textFilter = "";

  /** The collection of files to display in the component */
  public _files = new Array<IFileDefinition>();

  /** The file being previewed by the user */
  public _filePreviewed: IFileDefinition = null;

  /** The file uploader to use */
  public fileUploader: FileUploader;

  /** Identifier for the generic file type */
  public GenericFileType = 1;

  /** Identifier for the image file type */
  public ImageFileType = 2;

  /** Identifier for the video file type */
  public VideoFileType = 3;

  /** A reference to the input control that allows the user to upload files*/
  @ViewChild('inputFile')
  public inputFile: ElementRef;

  /** Will be triggered when the user picks a file from the list */
  @Output()
  public fileSelected= new EventEmitter<IFileDefinition>();

  /** Will be triggered when the users uploads successfully a file */
  @Output()
  public fileUploadSucceded = new EventEmitter<any>();

  /** Will be triggered when the users clicks outside of the component */
  @Output()
  public blur = new EventEmitter<any>();

  /** The height expressed as a valid css value */
  @Input()
  height = "350px";

  /** The options to configure the file uploader */
  @Input()
  set options(options: IFileUploadOptions) {
    this._fileUploadOptions = options;
    options.getToken().then((token) => {
      const fileUploaderOptions: FileUploaderOptions = {
        url: options.uploadFileUrl,
        headers: [{ name: 'Accept', value: 'application/json' }]
      }
      if(options.getToken) {
        fileUploaderOptions.authToken = "Bearer " + token
        fileUploaderOptions.authTokenHeader = "Authorization";
      }
      if(options.parametersToAdd) {
        fileUploaderOptions.additionalParameter = {};
        options.parametersToAdd.forEach((value, key) => {
          fileUploaderOptions.additionalParameter[key] = value;
        });
      }
      const  self = this;
      this.fileUploader = new class FileUploaderExt extends FileUploader {
        onCompleteAll() {
          if(self.inputFile) {
            self.inputFile.nativeElement.value = "";
          }

        }
        public onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
          console.log(response);
          self.fileUploadSucceded.emit(response);
          self.onFileUploaded(response);
          return { item, response, status, headers };
        }
      }(fileUploaderOptions);
      this.getFilesFromRemoteService();
    });

  };

  /**
   * Invokes the remote service to get the latest list of files
   */
  private getFilesFromRemoteService(): Promise<any> {
    return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      this.listFilesInBlobByPath(this._fileUploadOptions.parametersToAdd.get("path"), this._fileUploadOptions.isVideoList).then(remoteFiles => {
        this._filePreviewed = null;
        this._files = new Array<IFileDefinition>();
        remoteFiles.forEach(remoteFile => {
          this._files.push({
            url: remoteFile.absoluteUri,
            hidden: false,
            selected: false,
            lastModifiedDate: remoteFile.lastModified,
            size: this.humanFileSize(remoteFile.length, true),
            title: this.getFileName(remoteFile.absoluteUri),
            extension: this.getExtension(this.getFileName(remoteFile.absoluteUri)),
            fileType: this.getFileType(this.getExtension(this.getFileName(remoteFile.absoluteUri)))
          });
        });
        this.sortAndFilterCollection();
        resolve();
      }).catch(reason => reject(reason));
    });

  }

  /**
   * The collection of images to display in the component
   */
  @Input()
  get files(): Array<IFileDefinition> {
    return this._files;
  }

  /** The file upload options to be able to list and upload files */
  private _fileUploadOptions: IFileUploadOptions;

  /** The remote invocation promise by requested path */
  private _remoteInvocationPromiseByPath = new Map<string, Promise<any>>();

  /**
   * Invoked when a file is succesfully uploaded to the remote server
   *
   * @param response the response from the server
   */
  public onFileUploaded(response: any) {
    const result = JSON.parse(response);
    const results: IOperationResult<{fileName: string, url: string}> = result as IOperationResult<{fileName: string, url: string}>;
    if(results.success) {
      const  title = results.result.fileName;
      const url = results.result.url;
      this.getFilesFromRemoteService().then(() => {
        this._files.some(file => {
          if(file.url === url) {
            file.selected = true;
            file.hidden = false;
            this._filePreviewed = file;
            return true;
          }
          return false;
        });
      });
    }
  }

  /**
   * Lists all the files contained in a path of the blob.
   *
   * @param path the path to query in the remote blob container
   * @param isVideoList whether this is a list of video streams
   * @param queryCriteria the query criteria to use to fetch data from the remote service
   */
  public listFilesInBlobByPath(path: string, isVideoList: string): Promise<Array<{lastModified: string, length: number, absoluteUri: string}>> {
    const url = this._fileUploadOptions.listFilesUrl;
    if (!this._remoteInvocationPromiseByPath.has(url) || this._remoteInvocationPromiseByPath.get(url) === null) {
      this._remoteInvocationPromiseByPath.set(url, new Promise<Array<{lastModified: string, length: number, absoluteUri: string}>>((resolve, reject) => {
        this._fileUploadOptions.getToken().then((token) => {
          const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Bearer ' + token
              })
          };
          this.http.post(`${url}`, { ruta: path, isPathVideo: isVideoList}, httpOptions).subscribe((result) => {
                  const results: IOperationResult<Array<{lastModified: string, length: number, absoluteUri: string}>> = result as IOperationResult<Array<{lastModified: string, length: number, absoluteUri: string}>>;
                  this._remoteInvocationPromiseByPath.set(url, null);
                  if(results.success) {
                      resolve(results.result);
                  } else {
                      reject(results.message);
                  }
          }, (error) => {
            this._remoteInvocationPromiseByPath.set(url, null);
              reject(error);
          });
        });
      }));
    }
    return this._remoteInvocationPromiseByPath.get(url);
  }

  /**
   * Gets the filename of a url
   *
   * @param url the url to review
   * @returns the filename contained in the url
   */
  private getFileName(url: string): string {
    let fileName = url.substring(url.lastIndexOf('/')+1);
    if(fileName.indexOf("?") !== -1) {
      fileName = fileName.substr(0, fileName.lastIndexOf('?'));
    }
    return decodeURIComponent(fileName);
  }

  /**
   * Gets the extension of a file name
   *
   * @param fileName the fileName to review
   * @returns the extension of the file
   */
  private getExtension(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.')+1)
  }

  /**
   * Constructor of the class NgxFileListPickerComponent
   *
   * @param elementRef a reference to the element that hosts this component
   * @param http a reference to the http service for remote invocations
   */
  constructor(private elementRef: ElementRef, private http: HttpClient) {
  }

  /**
   * Handler of the click event outside of the component's container
   *
   * @param event the event that triggered this invocation
   * @param targetElement the element that was the target of the click
   */
  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement) {
          return;
      }
      const clickedInside = this.elementRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.blur.emit();
      }
  }

  /**
   * Handler of the change event for the filter field
   */
  public onFilterUpdated() {
    this.sortAndFilterCollection();
  }

  /**
   * Gets the file type that corresponds to the extension provided
   *
   * @param extension the extension of the file
   * @returns the file type that corresponds to the extension
   */
  public getFileType(extension: string): number {
    let fileType = 0;
    switch(extension.toLocaleLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      fileType = this.ImageFileType;
      break;
      case "mp4":
      case "webm":
      fileType = this.VideoFileType;
      break;
      default:
      fileType = this.GenericFileType;
      break;
    }
    return fileType;
  }

  /**
   * Handler of the click event for every element in the list of files
   *
   * @param image the image selected for preview
   */
  public onPreviewFile(file: IFileDefinition) {
    this._filePreviewed = file;
    this._files.forEach(aFile => {
        if(file.url === aFile.url) {
          aFile.selected = true;
        } else {
          aFile.selected = false;
        }
    });
  }

  /**
   * Handler of the click event for the select button on the list of images
   *
   * @param image the image that was selected by the user
   */
  public onFileSelected(file: IFileDefinition) {
    this.fileSelected.emit(file);
  }

  /**
   * Sorts the images by the title and then applies the current filter
   */
  private sortAndFilterCollection() {
    this._files = this._files.sort((a: IFileDefinition, b: IFileDefinition) => {
      return a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase());
    });
    this._files.forEach(image => {
      if(this._textFilter && this._textFilter !== '') {
        image.hidden = image.title.toLocaleLowerCase().search(this._textFilter.toLocaleLowerCase()) === -1;
      } else {
        image.hidden = false;
      }
    });
  }

  /**
   * generates a human readable version of the bytes size of a file
   *
   * @param bytes the bytes file size
   * @param si wheter to use a system or another
   */
  public humanFileSize(bytes: number, si: boolean): string {
    const thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
  }
}
