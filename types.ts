export interface ExtractedData {
  text: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}