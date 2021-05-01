import { Directory, MediaContainer } from "./common";

/**
 * /
 */
export type RootResponse = MediaContainer<Root>;

export interface Root {
  allowCameraUpload: boolean;
  allowChannelAccess: boolean;
  allowMediaDeletion: boolean;
  allowSharing: boolean;
  allowSync: boolean;
  allowTuners: boolean;
  backgroundProcessing: boolean;
  certificate: boolean;
  companionProxy: boolean;
  countryCode: string;
  diagnostics: string;
  eventStream: boolean;
  friendlyName: string;
  hubSearch: boolean;
  itemClusters: boolean;
  livetv: number;
  machineIdentifier: string;
  multiuser: boolean;
  myPlex: boolean;
  myPlexMappingState: string;
  myPlexSigninState: string;
  myPlexUsername: string;
  ownerFeatures: string;
  photoAutoTag: boolean;
  platform: string;
  platformVersion: string;
  pluginHost: boolean;
  pushNotifications: boolean;
  readOnlyLibraries: boolean;
  requestParametersInCookie: boolean;
  size: number;
  streamingBrainABRVersion: number;
  streamingBrainVersion: number;
  sync: boolean;
  transcoderActiveVideoSessions: number;
  transcoderAudio: boolean;
  transcoderLyrics: boolean;
  transcoderPhoto: boolean;
  transcoderSubtitles: boolean;
  transcoderVideo: boolean;
  transcoderVideoBitrates: string;
  transcoderVideoQualities: string;
  transcoderVideoResolutions: string;
  updatedAt: number,
  updater: boolean;
  version: string;
  voiceSearch: boolean;
  Directory: Directory[];
}