import { Spinner } from "@chakra-ui/react";
import { FC } from "react";
import { usePlexData } from "../../hooks/usePlexData";
import { AlbumsContainer } from "../../services/plex-api/response/library/sections/music";
import { convertAlbum } from "../../services/plex-response-ingest";
import { LibraryGrid } from "../LibraryGrid/LibraryGrid";

// TODO traverse API to find music library section
const endpoint = '/library/sections/3/albums';

/**
 * Request library data from Plex and pass to LibraryGrid component
 */
export const PlexMusicLibraryGrid: FC = () => {

  const { data: libraryResponse, isLoading, isError } = usePlexData<AlbumsContainer>(endpoint);


  if (isLoading) {
    return <Spinner/>
  }

  if (isError || libraryResponse === undefined) {
    return <p>Error loading music library data</p>;
  }

  const library = libraryResponse.MediaContainer.Metadata;

  return (
    <LibraryGrid
      library={library.map(album => convertAlbum(album))}
    />
  )
};
