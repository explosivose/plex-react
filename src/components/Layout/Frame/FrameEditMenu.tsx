
import { Button, ButtonGroup, Stack } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React, { FC } from "react";

interface Props {
  onRemove?: () => void;
}

export const FrameEditMenu: FC<Props> = ({onRemove}) => {

  return (
    <Stack>
      <ButtonGroup>
        <Button leftIcon={<CloseIcon />} onClick={onRemove}>
          Remove Frame
        </Button>
      </ButtonGroup>
    </Stack>
  )
};