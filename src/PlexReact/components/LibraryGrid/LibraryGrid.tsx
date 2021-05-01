import { SimpleGrid } from "@chakra-ui/react";
import React, { FC } from "react";
import { Metadata } from "../../types/metadata";
import { MetadataTile } from "../MetadataTile/MetadataTile";

interface Props {
  library: Metadata[];
  itemSize?: number;
}

export const LibraryGrid: FC<Props> = ({
  library,
  itemSize = 150,
}: Props) => {

  return (
    <SimpleGrid minChildWidth={itemSize} spacing={1} padding={16}>
      {/* TODO paginated */}
      {library.slice(0, 50).map(item => (
        <MetadataTile key={item.guid} metadata={item} size={itemSize} />
      ))}
    </SimpleGrid>
  );
};
