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

  @ViewChild('imageListPicker')
  imageListPicker: NgxImageListPickerComponent;

  title = 'demo';

  options: IFileUploadOptions = {
    url: 'https://admin-rest-web20190408042814.azurewebsites.net/api/FileUpload?code=D9frRBd4N362FDk6DunWWoQDcaSjeEouCzIC4OzaIozawIWe7mHVWQ==',
    getToken: () => 'eyJraWQiOiJFT0NmZFgwM3Y0Rmw1aThwTFl6ejE0enBScTNQYVk0V3EwSWNNMXRRekx3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjdnRVIzaVlyelJuVVFtbVpMeXphbjZwdm83UENmNDlDRXhpc09RY1FvQmMiLCJpc3MiOiJodHRwczovL2Rldi01NzIyMDQub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU1NzYyMzUxMywiZXhwIjoxNTU3NzA5OTEzLCJjaWQiOiIwb2FqcmIxYmh1ck9Sb05QbzBoNyIsInVpZCI6IjAwdWZuODdtazJpazgzdzQ4MGg3Iiwic2NwIjpbIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJzdWIiOiJqdWFuLm1leGljYUAyaHNvZnR3YXJlLmNvbS5teCJ9.Z4qb0k_VBT7ZOy7KLwQG5_Gd_hVgzddFvTLAXGuzYoR08ZwLbpG9S11HaCl63W_qL6zNoAvAFB_0HsDOLja2Wfy5I8fyuB4ZpMuu5t-qmnj9CnOE5s_hEl3eMb7jjfP5fUIu7pKfsqKSAHOyz3bkt1v7aA6oh5EzbGliHa7ZjlAFnKpJW2TR31_qaF7KPm9k16fSUS7MQl5hh8g4aBNGpTRWJQnyvoxaG9C0IoyHtLmWIAwqySxVdnPN1IFjmnwtvLyT_2aJOoFTF5ezgKni-feLij1i6_96d0tXWVvbA4pNAfPgYWynwDHgnEXXihc19Q8tXqBURxjLUptp13aBfw',
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
