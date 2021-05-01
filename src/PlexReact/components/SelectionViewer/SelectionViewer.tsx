import React, { FC, useContext, useEffect, useState } from "react";
import { MetadataViewer } from "../MetadataViewer/MetadataViewer";
import { SelectionContext } from "../../context/SelectionProvider";
import { Box } from "@chakra-ui/react";
import { Metadata } from "../../types/metadata";
import { convertMetadataView } from "../../services/plex-response-ingest";
import logdown from "logdown";

const logger = logdown('selection-viewer');

export const SelectionViewer: FC = () => {

  const [selection, key] = useContext(SelectionContext);
  const [metadata, setMetadata] = useState<Metadata | undefined>();

  useEffect(() => {
    if (selection && selection.MediaContainer) {
      const res = selection.MediaContainer;
      logger.debug(res);
      const md = convertMetadataView(res);
      logger.debug(md);
      setMetadata(md);
    }
  }, [selection, key])

  if (metadata === undefined) {
    return (
      <Box>
        <p>No selection</p>
      </Box>
    )
  }

  return (
    <MetadataViewer
      metadata={metadata}
    />
  )
};
