import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import React, { FC, useContext, useCallback } from "react";
import { ActionType, EditLayoutContext } from "../../Layout/EditLayoutProvider";

export const Navbar: FC = () => {

  const [{editModeEnabled}, editLayout] = useContext(EditLayoutContext);

  const handleEditModeButton = useCallback(() => {
    editLayout({type: ActionType.ToggleEditMode});
  }, [editLayout]);

  return (
    <Flex margin={1}>
      <Box>
        <Heading size="md">
          Plex React
        </Heading>
      </Box>
      <Spacer />
      <Button onClick={handleEditModeButton}>
        {editModeEnabled ? "Disable " : "Enable "} Edit Mode
      </Button>
    </Flex>
  )
}
