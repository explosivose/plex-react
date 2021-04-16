
import { Button, ButtonGroup, Center, Stack } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React, { FC } from "react";

interface Props {
  onRemove?: () => void;
}

export const FrameEditMenu: FC<Props> = ({onRemove}) => {

  return (
    <Center height="80%">
      <Stack bg="gray.500" padding={10} rounded={10}>
        <ButtonGroup>
          <Button leftIcon={<CloseIcon />} onClick={onRemove}>
            Remove Frame
          </Button>
        </ButtonGroup>
      </Stack>
    </Center>
  )
};