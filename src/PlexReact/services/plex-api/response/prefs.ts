import { MediaContainer } from "./common";

/**
 * /:/prefs
 */
export type PrefsResponse = MediaContainer<Prefs>;

export interface Prefs {
  size: number;
  Setting: Setting[];
}

export enum SettingType {
  Bool = "bool",
  Int = "int",
  Text = "text",
}

export enum SettingGroup {
  Butler = "butler",
  Channels = "channels",
  DLNA = "dlna",
  Extras = "extras",
  General = "general",
  Library = "library",
  Network = "network",
  None = "",
  Transcoder = "transcoder",
}

export interface Setting<T = string | boolean | number, E = SettingType> {
  advanced: boolean;
  default: T;
  group: SettingGroup;
  hidden: boolean;
  id: string;
  label: string;
  summary: string;
  type: E;
  value: T;
  /**
   * Enumerations are encoded here as "value:label|value:label|..."
   * For example: "0:All movies|1:Only watched movies"
   */
  enumValues?: string;
}

export type BoolSetting = Setting<boolean, SettingType.Bool>;
export type IntSetting = Setting<number, SettingType.Int>;
export type TextSetting = Setting<string, SettingType.Text>;
