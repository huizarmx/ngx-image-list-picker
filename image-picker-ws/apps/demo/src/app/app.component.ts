import { Component } from '@angular/core';
import { IFileUploadOptions, IFileDefinition } from '@image-picker-ws/ngx-image-list-picker';

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

  title = 'demo';

  options: IFileUploadOptions = {
    uploadFileUrl: 'https://admin-rest-web20190408042814.azurewebsites.net/api/FileUpload?code=D9frRBd4N362FDk6DunWWoQDcaSjeEouCzIC4OzaIozawIWe7mHVWQ==',
    listFilesUrl: 'https://admin-rest-web20190408042814.azurewebsites.net/api/GetPathFiles?code=SPE3UbPwC5frGvOaiajZz3LeJAPJ9/pJtkGs1RdPg3P2YE0n0G1hFw==',
    isVideoList: "true",
    getToken: () => {
      return new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
        resolve('eyJraWQiOiJFT0NmZFgwM3Y0Rmw1aThwTFl6ejE0enBScTNQYVk0V3EwSWNNMXRRekx3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk9QbnFsOFlMMzk3UnNaUXhnamdvUFo5RGVPWnp2Z3pFRjU4WnJrZEtVY2ciLCJpc3MiOiJodHRwczovL2Rldi01NzIyMDQub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU1Nzc5NzYwOSwiZXhwIjoxNTU3ODg0MDA5LCJjaWQiOiIwb2FqcmIxYmh1ck9Sb05QbzBoNyIsInVpZCI6IjAwdWZuODdtazJpazgzdzQ4MGg3Iiwic2NwIjpbIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJzdWIiOiJqdWFuLm1leGljYUAyaHNvZnR3YXJlLmNvbS5teCJ9.ET3MvnPCOsKQpDDLnSvz-DNWe6xaKp3T-XsgzCKpkWNW640kYk0tTcKYyTiW5S1HQ3czCQb-81oStrGTvVhRjUp0LfdpmLIFez9jUq6vKDqHSEWPdlxPFvksIO4XRuMLD0uZHbeiqmYsyO8hdBtnYWjdFBcE53s0KsX5rxbceU_7ZhhQNYcwn28A7zhuyghFOFynk6BzRiJjU7OHwT1Q0qU9olbmXUS4F6nVYrtjyw37qbR611q_gLtNXGJ276VD_27iCX25GRgpIROFOiCBPKVi59kuuBEhAodbVgi9AdsHIbh3LmqdkMCnzfJzfKka14b-wAF_WyNomutUkQdshg');
      });
    },
    parametersToAdd: new Map([['path','administradores']])
  }

  public onBlur() {
    console.log('blur!');
  }

  public onFileSelected(file: IFileDefinition) {
    console.log(file.url);
  }
}
