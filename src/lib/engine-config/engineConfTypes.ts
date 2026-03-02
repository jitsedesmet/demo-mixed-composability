export interface FileDescription {
  name: string;
  body: URL | string;
  prefixForImport: string;
}

export type FileDescriptions = FileDescription[];
