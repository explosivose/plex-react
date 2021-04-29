
import { Button, ButtonGroup, Center, Spacer, Stack } from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon
 } from "@chakra-ui/icons";
import React, { FC, useCallback, useContext, useState } from "react";
import { ActionType, EditLayoutContext } from "../../context/EditLayoutProvider";
import { ResizableSplit, SplitDirection } from "../ResizableSplit";
import { SimpleProps } from "../../services/tree";
import { LayoutComponent } from "../../services/layoutComponent.enum";
import { getUserRegisteredNames } from "../../services/layoutRegistry";

interface Props {
  onRemove?: () => void;
  layoutPath?: number[];
}

export const FrameEditMenu: FC<Props> = ({onRemove, layoutPath}) => {

  const [editLayout] = useContext(EditLayoutContext);
  const [userComponents] = useState(getUserRegisteredNames());

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

  const addComponent = useCallback((componentName: string) => {
    if (layoutPath) {
      editLayout({
        type: ActionType.ReplaceNodeWithComponent,
        replaceAtPath: layoutPath,
        replacementName: componentName,
      });
    }
  }, [editLayout, layoutPath]);



  return (
    <Center height="80%">
      <Stack bg="gray.500" padding={10} rounded={10}>
        <Stack>
          <Button leftIcon={<CloseIcon />} onClick={onRemove}>
            Remove Frame
          </Button>
          <ButtonGroup isAttached>
            <Button rightIcon={<ChevronLeftIcon />} onClick={splitLeft} />
            <Button leftIcon={<ChevronUpIcon />} onClick={splitUp} />
            <Button>
              Split
            </Button>
            <Button leftIcon={<ChevronDownIcon />} onClick={splitDown} />
            <Button leftIcon={<ChevronRightIcon />} onClick={splitRight} />
          </ButtonGroup>
        </Stack>
        <Spacer />
        <Stack overflowY="auto">
          {userComponents.map(componentName => (
            <Button leftIcon={<AddIcon />} onClick={() => addComponent(componentName)}>
              Add {componentName}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Center>
  )
};