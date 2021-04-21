
import { Button, Center, Stack } from "@chakra-ui/react";
import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import React, { FC, useCallback, useContext } from "react";
import { ActionType, EditLayoutContext, LayoutComponent } from "../EditLayoutProvider";

interface Props {
  onRemove?: () => void;
  layoutPath?: number[];
}

export const FrameEditMenu: FC<Props> = ({onRemove, layoutPath}) => {

  const [editLayout] = useContext(EditLayoutContext);

  const addSplit = useCallback(() => {
    if (layoutPath) {
      editLayout({
        type: ActionType.ReplaceNodeWithComponent,
        replaceAtPath: layoutPath,
        replacementName: LayoutComponent.ResizableSplit,
        reattachAsChild: 0,
      });
    }
  }, [editLayout, layoutPath]);

  return (
    <Center height="80%">
      <Stack bg="gray.500" padding={10} rounded={10}>
        <Button leftIcon={<CloseIcon />} onClick={onRemove}>
          Remove Frame
        </Button>
        <Button leftIcon={<DragHandleIcon />} onClick={addSplit}>
          Add split
        </Button>
      </Stack>
    </Center>
  )
};