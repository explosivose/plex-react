import { SimpleGrid } from "@chakra-ui/react";
import React, { FC } from "react";
import { AlbumTile } from "./AlbumTile";
import { useMusicLibrary } from "./useMusicLibrary";

interface Props {
  endpoint?: string;
}

export const MusicLibrary: FC<Props> = ({
 endpoint = '/library/sections/3/albums'
}) => {
  const {
    data
  } = useMusicLibrary(endpoint);
  const albums = data?.data.MediaContainer.Metadata;

  return (
    <SimpleGrid minChildWidth={100} spacing={8}>
      {/* TODO paginated */}
      {albums?.slice(0, 50).map(album => (
        <AlbumTile metadata={album} />
      ))}
    </SimpleGrid>
  );
};
