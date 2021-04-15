
import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import React, {  useContext } from "react";
import { EditLayoutContext } from "./EditLayoutProvider";
import { SplitDirection } from "./ResizableSplit";


export interface FrameProps {
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
        {...boxProps}
      >
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
