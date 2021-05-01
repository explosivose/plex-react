import { Box, Center, Image, Text } from "@chakra-ui/react";
import logdown from "logdown";
import { FC, useCallback, useContext } from "react";
import { SelectionContext } from "../../context/SelectionProvider";
import { usePlexImage } from "../../hooks/usePlexImage";
import { Metadata } from "../../types/metadata";

const logger = logdown('metadata-tile');

interface Props {
  metadata: Metadata;
  // TODO add size props
  size: number;
}


export const MetadataTile: FC<Props> =  ({metadata, size}) => {

  // usePlexImage is plex-specific but we could use hooks for other backend services
  // and select the result based on props. The hook should do nothing
  // when passed undefined imageUrl
  const image = usePlexImage({imageUrl: metadata.thumb, width: size, height: size});

  const [, selectionKey, setSelectionKey] = useContext(SelectionContext);

  const title = metadata.parentTitle ?? metadata.title;
  const subtitle = metadata.parentTitle ? metadata.title : undefined;
  const selected = selectionKey === metadata.key

  const select = useCallback(() => {
    logger.debug(metadata);
    setSelectionKey(metadata.key);
  },[metadata, setSelectionKey]);

  return (
    <Box
      w={size}
      h={size + 40}
      padding={4}
      rounded={10}
      onMouseDown={select}
      onTouchStart={select}
      bg={selected ? "blue.200" : undefined}
      _hover={selected ? undefined : {bg: "gray.300"}}
    >
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
