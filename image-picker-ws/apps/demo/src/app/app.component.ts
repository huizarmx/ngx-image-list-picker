import { Component, ViewChild } from '@angular/core';
import { IImageDefinition, IFileUploadOptions } from '@image-picker-ws/ngx-image-list-picker';
import { NgxImageListPickerComponent } from 'libs/ngx-image-list-picker/src/lib/ngx-image-list-picker.component';

export class OperationResult<T> {

  /* Flag that indicates if the porccess sucess. */
  public success: boolean;

  /* The result message. */
  public message: string;

  /* The result of the request. */
  public result: T;
}

@Component({
  selector: 'image-picker-ws-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  imageListPicker: NgxImageListPickerComponent;

  title = 'demo';

  options: IFileUploadOptions = {
    url: 'https://admin-rest-web20190408042814.azurewebsites.net/api/FileUpload?code=D9frRBd4N362FDk6DunWWoQDcaSjeEouCzIC4OzaIozawIWe7mHVWQ==',
    getToken: () => {
      return new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
        resolve('eyJraWQiOiJFT0NmZFgwM3Y0Rmw1aThwTFl6ejE0enBScTNQYVk0V3EwSWNNMXRRekx3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlZ5TjU2WUx0SDlhNTBsalVMTGo3Q1U3eVRvVEtNYnRrQ25zdTZnTFcyclEiLCJpc3MiOiJodHRwczovL2Rldi01NzIyMDQub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU1NzcxMDE2OCwiZXhwIjoxNTU3Nzk2NTY4LCJjaWQiOiIwb2FqcmIxYmh1ck9Sb05QbzBoNyIsInVpZCI6IjAwdWZuODdtazJpazgzdzQ4MGg3Iiwic2NwIjpbInByb2ZpbGUiLCJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJqdWFuLm1leGljYUAyaHNvZnR3YXJlLmNvbS5teCJ9.t_29Ugc6peV2kaICRP8Jlqq3k8BUa5AC-w4u3-0eZWW6oJ3mSbtjzki_oKdT2SZmTx78a3lAw5snGYRchOcKGIbgXPMT8AAQAHNz3dkWddxPcPwaVo-oox71zYuxnT99eLWqiVNok2URPJJIVj6yjKmSdncXgH-ge4tSRIKB0xVuFjIvmnMdyKCdkyEQTiDEOlWfG5ssGTR2UgkY5WxfUlty9pXxJ95EbJMtFm_oWMEeBGcWxn9D_c3qauSBv4JjF0iE8US5JZtVNFXD4R9CpNs8UmxC7jpl5l5wT5XwNG_w8p_jGVUkrzD-GMg8dYkNLCrtd8uwUqwDUPbUXJ0BOQ');
      });
    },
    parametersToAdd: new Map([['path','upload/taxonomia-equipo-bmv']])
  }

  images: Array<IImageDefinition> = [
    {
      url: "https://bmvapp.blob.core.windows.net/bmv-app-container/images/upload/taxonomia-equipo-bmv/IMG_5832.png",
      title: 'IMG_5832.png'
    },
    {
      url: "https://bmvapp.blob.core.windows.net/bmv-app-container/images/upload/taxonomia-equipo-bmv/iphone-8-mockup-downloadable.png",
      title: 'iphone-8-mockup-downloadable.png'
    },
    {
      url: "https://bmvapp.blob.core.windows.net/bmv-app-container/images/upload/taxonomia-equipo-bmv/logo_xbrl_bot.png",
      title: 'logo_xbrl_bot.png'
    }
  ];

  public onBlur() {
    console.log('blur!');
  }

  public onImageSelected(image: IImageDefinition) {
    console.log(image.url);
  }

  public onImagePickerInit(imagePickerComponent: NgxImageListPickerComponent) {
    this.imageListPicker = imagePickerComponent;
  }

  public onFileUploaded(response: any) {
    const result = JSON.parse(response);
    const results: OperationResult<{Title: string, Description: string, Order: number, Source: string}> = Object.setPrototypeOf(result, OperationResult.prototype);
    if(results.success) {
      const imageDefinition: IImageDefinition =  {
        title: results.result.Title,
        url: results.result.Source
      };
      const newImages = JSON.parse(JSON.stringify(this.imageListPicker.images)) as Array<IImageDefinition>;
      newImages.push(imageDefinition);
      this.images = newImages;
      setTimeout(() => {
        this.imageListPicker.setSelectedImage(imageDefinition);
      }, 0);
    }
  }

  /**
   * Gets the filename of a url
   *
   * @param url the url to review
   */
  private getFileName(url: string): string {
    return url.substring(url.lastIndexOf('/')+1);
  }

}
