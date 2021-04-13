
import { Box, BoxProps } from "@chakra-ui/react";
import logdown from "logdown";
import React, {
  Children,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Frame } from "./Frame";

const logger = logdown('layout/resizable-split');

export enum SplitDirection {
  Vertical = "vertical",
  Horizontal = "horizontal"
}

const RESIZE_CONTAINER_PROPS: BoxProps = {
  display: "flex",
  flex: 1,
  height: "100%",
  position: "absolute",
  outline: "none",
  overflow: "hidden"
}
const V_RESIZE_CONTAINER_PROPS: BoxProps = {
  ...RESIZE_CONTAINER_PROPS,
  flexDirection: "row",
  left: 0,
  right: 0,
}
const H_RESIZE_CONTAINER_PROPS: BoxProps = {
  ...RESIZE_CONTAINER_PROPS,
  flexDirection: "column",
  minHeight: "100%",
  width: "100%",
  bottom: 0,
  top: 0,
}

const RESIZE_HANDLE_SIZE = 3;
const RESIZE_HANDLE_COLOR = "#0FFF";
const RESIZE_HANDLE_COLOR_HOVER = "#8000";
const V_HANDLE_PROPS: BoxProps = {
  width: RESIZE_HANDLE_SIZE,
  marginRight: -1,
  marginTop: 0,
  borderLeftWidth: 1,
  borderLeftColor: RESIZE_HANDLE_COLOR,
  borderRightWidth: 1,
  borderRightColor: RESIZE_HANDLE_COLOR,
  cursor: "col-resize",
  _hover: {
    borderLeftColor: RESIZE_HANDLE_COLOR_HOVER,
    borderRightColor: RESIZE_HANDLE_COLOR_HOVER
  }
}
const H_HANDLE_PROPS: BoxProps = {
  height: RESIZE_HANDLE_SIZE,
  marginTop: -1,
  marginRight: 0,
  borderTopWidth: 1,
  borderTopColor: RESIZE_HANDLE_COLOR,
  borderBottomWidth: 1,
  borderBottomColor: RESIZE_HANDLE_COLOR,
  cursor: "row-resize",
  _hover: {
    borderTopColor: RESIZE_HANDLE_COLOR_HOVER,
    borderBottomColor: RESIZE_HANDLE_COLOR_HOVER
  }
}

const FRAME_BOX_PROPS: BoxProps = {
  flex: 1,
  position: "relative",
}

export interface ResizableSplitProps {
  resizeEnabled?: boolean;
  splitDirection?: SplitDirection;
  onResizeStart?: () => void;
  boxProps?: BoxProps;
  initialSize?: number;
}

/**
 * Inspired by tomkp/react-split-pane
 */
export const ResizableSplit: FC<ResizableSplitProps> = ({
  resizeEnabled = true,
  splitDirection = SplitDirection.Vertical,
  onResizeStart,
  initialSize,
  boxProps,
  children
}) => {

  const [resizeActive, setResizeActive] = useState(false);
  const [resizePosition, setResizePosition] = useState(0);
  const [frameOneSize, setFrameOneSize] = useState(initialSize);
  const frameOne = useRef<HTMLDivElement>(null);
  const frameTwo = useRef<HTMLDivElement>(null);

  const onStart = useCallback(({x, y}: {x: number; y: number}) => {
    if (resizeEnabled) {
      setResizeActive(true);
      setResizePosition(splitDirection === SplitDirection.Vertical
        ? x
        : y);
      if (onResizeStart) {
        onResizeStart();
      }
    }
  }, [resizeEnabled, splitDirection, onResizeStart]);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    onStart({
      x: event.clientX,
      y: event.clientY
    });
  }, [onStart]);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    onStart({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  }, [onStart]);

  const onMove = useCallback((position: number) => {
    // FIXME this appears to be calculating the wrong sizes or positions...
    if (resizeActive && resizeEnabled) {
      if (frameOne.current && frameTwo.current) {
        const { width, height } = frameOne.current.getBoundingClientRect();
        const size = splitDirection === SplitDirection.Vertical
          ? width : height;
        const positionDelta = position - resizePosition;
        let sizeDelta = positionDelta;
        // if frames are flex items and have been arranged in a different order
        const frameOneOrder = window.getComputedStyle(frameOne.current).order;
        const frameTwoOrder = window.getComputedStyle(frameTwo.current).order;
        if (frameOneOrder > frameTwoOrder) {
          sizeDelta = -sizeDelta;
        }
        setResizePosition(position - positionDelta);
        setFrameOneSize(size - sizeDelta);
      }
    }
  }, [
    resizeActive,
    resizeEnabled,
    frameOne,
    frameTwo,
    resizePosition,
    splitDirection,
  ]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    onMove(splitDirection === SplitDirection.Vertical
      ? event.clientX : event.clientY);
  }, [
    splitDirection,
    onMove
  ]);

  const onTouchMove = useCallback((event: TouchEvent) => {
    onMove(splitDirection === SplitDirection.Vertical
      ? event.touches[0].clientX : event.touches[0].clientY);
  }, [
    splitDirection,
    onMove
  ]);

  const onMouseUp = useCallback(() => {
    setResizeActive(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    return function() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
    }
  }, [onMouseMove, onTouchMove, onMouseUp])

  const childArray = Children.toArray(children);
  return (
    <Box
      {...splitDirection === SplitDirection.Vertical
        ? V_RESIZE_CONTAINER_PROPS
        : H_RESIZE_CONTAINER_PROPS}
      {...boxProps}
    >
      <Frame
        ref={frameOne}
        splitDirection={splitDirection}
        splitSize={frameOneSize}
        boxProps={FRAME_BOX_PROPS}
      >
        {childArray?.[0]}
      </Frame>
      <Box
        as="span"
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        onTouchEnd={onMouseUp}
        {...splitDirection === SplitDirection.Vertical
          ? V_HANDLE_PROPS
          : H_HANDLE_PROPS}
      />
      <Frame
        ref={frameTwo}
        boxProps={FRAME_BOX_PROPS}
      >
        {childArray?.[1]}
      </Frame>
    </Box>
  )
};
