import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { usePlexImage } from "../../hooks/usePlexImage";
import { Metadata, MetadataType } from "../../types/metadata";

const imageSize = 300;

interface Props {
  metadata: Metadata;
}

export const MetadataViewer: FC<Props> = ({metadata}) => {

  const image = usePlexImage({imageUrl: metadata.thumb, width: imageSize, height: imageSize});

  return (
    <Box paddingLeft={16} paddingRight={16} paddingTop={4} paddingBottom={4} >
      <Heading size="lg">
        {metadata.title}
      </Heading>
      <Stack direction="row">
        <Image src={image} rounded={10} />
        <Box paddingTop={8} >
          {metadata.parentTitle ?
          <Heading size="md">
            {metadata.parentTitle}
          </Heading> : null}
          {metadata.type === MetadataType.Album ||
            metadata.type === MetadataType.Season ||
            metadata.type === MetadataType.Episode ||
            metadata.type === MetadataType.Film ?
          <Heading size="md">
            {metadata.year}
          </Heading> : null}
        </Box>
      </Stack>
      <Text textAlign="right">
        {metadata.duration}
      </Text>
    </Box>
  )
};
