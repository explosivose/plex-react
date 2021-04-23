import { Box, Image } from "@chakra-ui/react";
import React, { FC } from "react";
import { AlbumMetadata } from "../../../services/plex-api/response/common";
import { usePlexImage } from "./usePlexImage";

interface Props {
  metadata: AlbumMetadata;
}

export const AlbumTile: FC<Props> =  ({metadata}) => {

  const image = usePlexImage({imageUrl: metadata.thumb});

  return (
    <Box w={100} h={140}>
      <Image src={image} /> 
      {metadata.title}
      {metadata.parentTitle}
    </Box>
  );
};
