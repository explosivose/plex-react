import { useContext, useEffect, useState } from "react"
import { 
  useQuery } from "react-query";
import { plexQueryFn, PlexRequestOptions } from "../services/plex-api";
import { PlexAuthContext } from "../context/PlexAuthProvider/PlexAuthProvider"
import { PlexReactConfigContext } from "../context/PlexReactConfigProvider";

type ImageResponse = ArrayBuffer;

interface PlexImageOptions {
  imageUrl?: string;
  endpoint?: string;
  width?: number;
  height?: number;
}

export const usePlexImage = ({
  imageUrl,
  endpoint = '/photo/:/transcode',
  width = 100,
  height = 100
}: PlexImageOptions): string | undefined => {
  const { authToken } = useContext(PlexAuthContext);
  const [{ plexUrl }] = useContext(PlexReactConfigContext);

  const fetchUrl = `${endpoint}?url=${imageUrl}&width=${width}&height=${height}`;

  const { data: imageResponse } = useQuery<ImageResponse, unknown, ImageResponse, [string, PlexRequestOptions]>([
    'image', {
      authToken,
      apiUrl: plexUrl,
      endpoint: fetchUrl,
      responseType: 'arraybuffer',
    }],
    plexQueryFn, {
      enabled: imageUrl !== undefined
  });

  const [objectUrl, setObjectUrl] = useState(imageResponse
    ? URL.createObjectURL(new Blob([imageResponse]))
    : undefined);

  useEffect(() => {
    setObjectUrl(oldUrl => {
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }
      return imageResponse
        ? URL.createObjectURL(new Blob([imageResponse]))
        : undefined;
    });
  }, [imageResponse]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  });

  return objectUrl;
};
