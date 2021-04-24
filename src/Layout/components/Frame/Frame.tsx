
import { Box, BoxProps, forwardRef, Heading } from "@chakra-ui/react";
import React, {  useContext } from "react";
import { EditLayoutContext } from "../../context/EditLayoutProvider";
import { useLayoutNode } from "../../hooks/useLayoutNode";
import { LayoutNodeProps } from "../../Layout";
import { SplitDirection } from "../ResizableSplit";
import { FrameEditMenu } from "./FrameEditMenu";

export interface FrameProps extends LayoutNodeProps {
  boxProps?: BoxProps;
  onRemove?: () => void;
  splitDirection?: SplitDirection;
  /**
   * In pixels
   */
  splitSize?: number;
}

export const Frame = forwardRef<FrameProps, "div">(({
  boxProps,
  splitDirection,
  splitSize,
  onRemove,
  layoutPath,
  editable,
  children
}, ref) => {

  const [, [editModeEnabled]] = useContext(EditLayoutContext);
  const childNode = useLayoutNode(layoutPath ?? []);

  let width: string | undefined;
  let height: string | undefined;

  if (splitDirection) {
    if (splitDirection === SplitDirection.Vertical) {
      width = `${splitSize}px`;
    } else {
      height = `${splitSize}px`;
    }
  }

  if (editModeEnabled && editable) {
    return (
      <Box 
        ref={ref}
        style={{height, width}}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray"
        padding={4}
        {...boxProps}
      >
        <Heading size="md" textColor="GrayText">
          {childNode
            ? childNode.componentName
            : "Add content to frame..."}
        </Heading>
        <FrameEditMenu
          onRemove={onRemove} 
          layoutPath={layoutPath}
        />
        {/* TODO content preview */}
        {/* TODO edit mode menu translucent on top of content preview*/}
      </Box>
    )
  }

  return (
    <Box
      ref={ref}
      style={{height, width}}
      {...boxProps}
    >
      {children}
    </Box>
  )
});
