/**
 * The information about every image listed required by the component.
 *
 * @author José Antonio Huizar Moreno
 * @version 1.0
 */
export interface IImageDefinition {
  url: string;
  title: string;
}

/**
 * The information about every file listed required by the component.
 *
 * @author José Antonio Huizar Moreno
 * @version 1.0
 */
export interface IFileDefinition {
  url: string;
  title: string;
  size: string;
  lastModifiedDate: string;
  selected: boolean;
  hidden: boolean;
  extension: string;
  fileType: number;
}

/**
 * The information returned by the remote service to list and upload files.
 *
 * @author José Antonio Huizar Moreno
 * @version 1.0
 */
export interface IOperationResult<T> {

  /* Flag that indicates if the porccess sucess. */
  success: boolean;

  /* The result message. */
  message: string;

  /* The result of the request. */
  result: T;
}

/**
 * The options to use to configure the file uploader
 *
 * @author José Antonio Huizar Moreno
 * @version 1.0
 */
export interface IFileUploadOptions {
  listFilesUrl: string;
  uploadFileUrl: string;
  isVideoList: string;
  parametersToAdd: Map<string, string>;
  getToken: () => Promise<string>;
}
