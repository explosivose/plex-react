import { Box, Center, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import { usePlexImage } from "../../hooks/usePlexImage";
import { Metadata } from "../../types/metadata";

interface Props {
  metadata: Metadata;
  // TODO add size props
}


export const MetadataTile: FC<Props> =  ({metadata}) => {

  // usePlexImage is plex-specific but we could use hooks for other backend services
  // and select the result based on props. The hook should do nothing
  // when passed undefined imageUrl
  const image = usePlexImage({imageUrl: metadata.thumb});

  const title = metadata.parentTitle ?? metadata.title;
  const subtitle = metadata.parentTitle ? metadata.title : undefined;

  return (
    <Box w={100} h={140}>
      <Image src={image} rounded={10}/> 
        <Center>
          <Text isTruncated>
            {title}
          </Text>
        </Center>
        {subtitle && <Center>
          <Text isTruncated color="GrayText">
            {subtitle}
          </Text>
        </Center>}
    </Box>
  );
};
