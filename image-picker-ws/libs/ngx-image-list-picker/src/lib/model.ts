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
 * The options to use to configure the file uploader
 *
 * @author José Antonio Huizar Moreno
 * @version 1.0
 */
export interface IFileUploadOptions {
  url: string;
  parametersToAdd: Map<string, string>;
  getToken: () => string;
}
