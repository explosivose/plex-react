
import { Box, BoxProps, forwardRef, Heading } from "@chakra-ui/react";
import React, {  useContext } from "react";
import { EditLayoutContext } from "../EditLayoutProvider";
import { SplitDirection } from "../ResizableSplit";
import { FrameEditMenu } from "./FrameEditMenu";


export interface FrameProps {
  boxProps?: BoxProps;
  onRemove?: () => void;
  splitDirection?: SplitDirection;
  /**
   * In pixels
   */
  splitSize?: number;
  layoutPath?: number[];
}

export const Frame = forwardRef<FrameProps, "div">(({
  boxProps,
  splitDirection,
  splitSize,
  onRemove,
  children
}, ref) => {

  const [{editModeEnabled}] = useContext(EditLayoutContext);


  let width: string | undefined;
  let height: string | undefined;

  if (splitDirection) {
    if (splitDirection === SplitDirection.Vertical) {
      width = `${splitSize}px`;
    } else {
      height = `${splitSize}px`;
    }
  }

  if (editModeEnabled) {
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
        <Heading size="md">
          "Content Name"
        </Heading>
        <FrameEditMenu
          onRemove={onRemove} 
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
