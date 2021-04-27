import { SimpleGrid } from "@chakra-ui/react";
import React, { FC } from "react";
import { Metadata } from "../../types/metadata";
import { MetadataTile } from "../MetadataTile/MetadataTile";

interface Props {
  library: Metadata[];
}

export const LibraryGrid: FC<Props> = ({
  library
}: Props) => {

  return (
    <SimpleGrid minChildWidth={100} spacing={8} padding={16}>
      {/* TODO paginated */}
      {library.slice(0, 50).map(item => (
        <MetadataTile key={item.guid} metadata={item} />
      ))}
    </SimpleGrid>
  );
};
