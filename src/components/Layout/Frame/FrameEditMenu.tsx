
import { Button, Center, Stack } from "@chakra-ui/react";
import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import React, { FC, useCallback, useContext } from "react";
import { ActionType, EditLayoutContext, LayoutComponent } from "../EditLayoutProvider";
import { ResizableSplit, SplitDirection } from "../ResizableSplit";
import { SimpleProps } from "../Layout";

interface Props {
  onRemove?: () => void;
  layoutPath?: number[];
}

export const FrameEditMenu: FC<Props> = ({onRemove, layoutPath}) => {

  const [editLayout] = useContext(EditLayoutContext);

  const addSplit = useCallback((splitDirection = SplitDirection.Vertical, splitPosition: 0 | 1 = 0) => {
    if (layoutPath) {
      editLayout({
        type: ActionType.ReplaceNodeWithComponent,
        replaceAtPath: layoutPath,
        replacementName: LayoutComponent.ResizableSplit,
        reattachAsChild: splitPosition,
        replacementProps: {
          splitDirection
        } as SimpleProps<typeof ResizableSplit>
      });
    }
  }, [editLayout, layoutPath]);

  const splitLeft = useCallback(() => {
    addSplit(SplitDirection.Vertical, 0);
  }, [addSplit]);

  const splitRight = useCallback(() => {
    addSplit(SplitDirection.Vertical, 1);
  }, [addSplit]);

  const splitUp = useCallback(() => {
    addSplit(SplitDirection.Horizontal, 0);
  }, [addSplit]);

  const splitDown = useCallback(() => {
    addSplit(SplitDirection.Horizontal, 1);
  }, [addSplit]);

  return (
    <Center height="80%">
      <Stack bg="gray.500" padding={10} rounded={10}>
        <Button leftIcon={<CloseIcon />} onClick={onRemove}>
          Remove Frame
        </Button>
        <Button leftIcon={<DragHandleIcon />} onClick={splitLeft}>
          Split Left
        </Button>
        <Button leftIcon={<DragHandleIcon />} onClick={splitRight}>
          Split Right
        </Button>
        <Button leftIcon={<DragHandleIcon />} onClick={splitUp}>
          Split Up
        </Button>
        <Button leftIcon={<DragHandleIcon />} onClick={splitDown}>
          Split Down
        </Button>
      </Stack>
    </Center>
  )
};