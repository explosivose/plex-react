export type Media = AudioMedia | VideoMedia;

export interface AudioMedia {
  audioChannels: number;
  audioCodec: number;
  bitrate: number;
  container: string;
  duration: number;
  id: number;
  Part: Part[];
}

export interface VideoMedia {
  aspectRatio: number;
  audioChannels: number;
  audioCodec: string;
  bitrate: number;
  container: string;
  duration: number;
  height: number;
  id: number;
  videoCodec: string;
  videoFrameRate: string;
  videoProfile: string;
  videoResolution: string;
  width: number;
  Part: Part[];
}

export interface Part {
  container: string;
  duration: number;
  file: string;
  id: number;
  key: string;
  size: number;
  hasThumbnail?: string;
  videoProfile?: string;
  Stream?: Stream[];
}

export type Stream  = VideoStream | AudioStream;

export interface VideoStream {
  bitrate: number;
  codec: string;
  displayTitle: string;
  framerate: number;
  height: number;
  id: number;
  index: number;
  level: number;
  profile: string;
  streamType: 1;
  width: number;
  bitDepth?: number;
  chromaLocation?: string;
  chromaSubsampling?: string;
  codedHeight?: string;
  codedWidth?: string;
  colorPrimaries?: string;
  colorRange?: string;
  colorSpace?: string;
  colorTrc?: string;
  default?: boolean;
  hasScalingMatrix?: boolean;
  language?: string;
  languageCode?: string;
  refFrames?: string;
  scanType?: string;
}

export interface AudioStream {
  bitrate: number;
  channels: number;
  codec: string;
  displayTitle: string;
  id: number;
  index: number;
  profile: string;
  samplingRate: number;
  streamType: 2;
  default?: boolean;
  language?: string;
  languageCode?: string;
  selected?: boolean;
}
