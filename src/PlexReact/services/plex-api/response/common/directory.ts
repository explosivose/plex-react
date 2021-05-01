
export interface Directory {
  key: string;
  title: string;
  leafCount?: number;
  thumb?: string;
  viewedLeafCount?: number;
  count?: number;
  secondary?: boolean;
  search?: boolean;
  prompt?: string;
  share?: number;
  hasStoreServices?: boolean;
  hasPrefs?: boolean;
  identifier?: string;
  lastAccessedAt?: number;
}
