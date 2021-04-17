
import { Box, BoxProps } from "@chakra-ui/react";
import logdown from "logdown";
import React, {
  Children,
  FC,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ActionType, EditLayoutContext } from "./EditLayoutProvider";
import { Frame } from "./Frame";
import { LayoutNodeProps } from "./Layout";

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
// TODO get colors from chakra theme
const RESIZE_HANDLE_COLOR = "#EEEEEEEE";
const RESIZE_HANDLE_COLOR_HOVER = "#222222EE";
const V_HANDLE_PROPS: BoxProps = {
  width: RESIZE_HANDLE_SIZE,
  minWidth: RESIZE_HANDLE_SIZE,
  marginRight: -1,
  marginTop: 0,
  borderLeftWidth: 1,
  borderLeftColor: RESIZE_HANDLE_COLOR,
  borderRightWidth: 1,
  borderRightColor: RESIZE_HANDLE_COLOR,
  cursor: "col-resize",
  _hover: {
    transition: "all 1s ease",
    borderLeftColor: RESIZE_HANDLE_COLOR_HOVER,
    borderRightColor: RESIZE_HANDLE_COLOR_HOVER
  }
}
const H_HANDLE_PROPS: BoxProps = {
  height: RESIZE_HANDLE_SIZE,
  minHeight: RESIZE_HANDLE_SIZE,
  marginTop: -1,
  marginRight: 0,
  borderTopWidth: 1,
  borderTopColor: RESIZE_HANDLE_COLOR,
  borderBottomWidth: 1,
  borderBottomColor: RESIZE_HANDLE_COLOR,
  cursor: "row-resize",
  _hover: {
    transition: "all 1s ease",
    borderTopColor: RESIZE_HANDLE_COLOR_HOVER,
    borderBottomColor: RESIZE_HANDLE_COLOR_HOVER
  }
}

const FRAME_BOX_PROPS: BoxProps = {
  position: "relative",
  flex: "none",
  overflow: "auto",
}

const clearSelection = () => {
  window.getSelection?.()?.empty?.();
  window.getSelection?.()?.removeAllRanges?.();
}

export interface ResizableSplitProps extends LayoutNodeProps {
  resizeEnabled?: boolean;
  splitDirection?: SplitDirection;
  onResizeStart?: () => void;
  boxProps?: BoxProps;
}

/**
 * Inspired by tomkp/react-split-pane and zesik/react-splitter-layout
 */
export const ResizableSplit: FC<ResizableSplitProps> = ({
  resizeEnabled = true,
  splitDirection = SplitDirection.Vertical,
  onResizeStart,
  boxProps,
  layoutPath,
  children
}) => {

  const [editLayout] = useContext(EditLayoutContext);
  const [resizeActive, setResizeActive] = useState(false);
  const [frameOneSize, setFrameOneSize] = useState(0);
  const [frameTwoSize, setFrameTwoSize] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const frameOne = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const frameTwo = useRef<HTMLDivElement>(null);

  const onStart = useCallback(() => {
    if (resizeEnabled) {
      setResizeActive(true);
      if (onResizeStart) {
        onResizeStart();
      }
    }
  }, [resizeEnabled, onResizeStart]);

  const onMouseDown = useCallback((event?: React.MouseEvent) => {
    clearSelection();
    onStart();
  }, [onStart]);

  const onTouchStart = useCallback((event?: React.TouchEvent) => {
    onMouseDown();
  }, [onMouseDown]);

  const doResize = useCallback((sizes: {frameOneSize: number; frameTwoSize: number}) => {
    if (resizeEnabled && resizeActive) {
      setFrameOneSize(sizes.frameOneSize);
      setFrameTwoSize(sizes.frameTwoSize);
    }
  }, [
    resizeActive,
    resizeEnabled
  ]);

  const calculateResize = useCallback((position: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const containerRect = container.current!.getBoundingClientRect();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handleRect = handle.current!.getBoundingClientRect();
    let containerSize: number;
    let handleSize: number;
    let offset: number;
    if (splitDirection === SplitDirection.Vertical) {
      containerSize = containerRect.width;
      handleSize = handleRect.width;
      offset = position - handleRect.width / 2; 
    } else {
      containerSize = containerRect.height;
      handleSize = handleRect.height;
      offset = position - handleRect.height / 2;
    }
    if (offset < 0) {
      offset = 0;
    } else if (offset > containerSize - handleSize) {
      offset = containerSize - handleSize;
    }
    const newFrameTwoSize = containerSize - handleSize - offset;
    return {
      frameOneSize: containerSize - handleSize - newFrameTwoSize,
      frameTwoSize: newFrameTwoSize,
    };
  }, [
    splitDirection,
  ]);

  // set size on mount
  useLayoutEffect(() => {
    logger.debug('useLayoutEffect fired to initialize split');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const containerRect = container.current!.getBoundingClientRect();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handleRect = handle.current!.getBoundingClientRect();
    const newSizes = calculateResize(splitDirection === SplitDirection.Vertical
      ? containerRect.left + ((containerRect.width - handleRect.width) / 2)
      : containerRect.top + ((containerRect.height - handleRect.height) / 2));
    // do not use doResize here because it incurs a dependency on resizeActive
    // which will re-trigger this effect.
    setFrameOneSize(newSizes.frameOneSize);
    setFrameTwoSize(newSizes.frameTwoSize);
  }, [
    calculateResize,
    splitDirection
  ])

  const onMouseMove = useCallback((event: MouseEvent) => {
    clearSelection();
    const newSizes = calculateResize(splitDirection === SplitDirection.Vertical
      ? event.clientX : event.clientY);
    doResize(newSizes);
  }, [
    splitDirection,
    calculateResize,
    doResize,
  ]);

  const onTouchMove = useCallback((event: TouchEvent) => {
    clearSelection();
    const newSizes = calculateResize(splitDirection === SplitDirection.Vertical
      ? event.touches[0].clientX : event.touches[0].clientY);
    doResize(newSizes);
  }, [
    splitDirection,
    calculateResize,
    doResize,
  ]);

  const onMouseUp = useCallback(() => {
    setResizeActive(false);
  }, []);

  const onWindowResize = useCallback(() => {
    if (handle.current) {
      const handleRect = handle.current.getBoundingClientRect();
      const newSizes = calculateResize(splitDirection === SplitDirection.Vertical
        ? handleRect.x : handleRect.y);
      // don't call doResize here as we are doing an automated resize
      // without checking resizeActive and resizeEnabled
      setFrameOneSize(newSizes.frameOneSize);
      setFrameTwoSize(newSizes.frameTwoSize);
    }
  }, [calculateResize, splitDirection]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    return function() {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
    }
  }, [onMouseMove, onTouchMove, onMouseUp, onWindowResize]);

  const replaceWithFrame = useCallback((frameToKeep: 1 | 2) => {
    if (layoutPath) {
      const frameLayoutPath = layoutPath.concat(frameToKeep - 1); // -1 for zero indexing
       editLayout({
        type: ActionType.ReplaceNodeWithPath,
        replaceAtPath: layoutPath,
        replaceWithPath: frameLayoutPath,
      });
    }
  }, [editLayout, layoutPath]);

  const onRemoveFrameOne = useCallback(() => {
    // if frameOne is removed then keep frameTwo
    replaceWithFrame(2);
  }, [replaceWithFrame]);

  const onRemoveFrameTwo = useCallback(() => {
    // if frameTwo is removed then keep FrameOne
    replaceWithFrame(1);
  }, [replaceWithFrame]);

  const childArray = Children.toArray(children);
  return (
    <Box
      {...splitDirection === SplitDirection.Vertical
        ? V_RESIZE_CONTAINER_PROPS
        : H_RESIZE_CONTAINER_PROPS}
      {...boxProps}
      ref={container}
    >
      <Frame
        ref={frameOne}
        splitDirection={splitDirection}
        splitSize={frameOneSize}
        boxProps={FRAME_BOX_PROPS}
        onRemove={onRemoveFrameOne}
      >
        {childArray?.[0]}
      </Frame>
      <Box
        ref={handle}
        as="span"
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        onTouchEnd={onMouseUp}
        // TODO disabled styling
        {...splitDirection === SplitDirection.Vertical
          ? V_HANDLE_PROPS
          : H_HANDLE_PROPS}
      />
      <Frame
        ref={frameTwo}
        boxProps={FRAME_BOX_PROPS}
        splitDirection={splitDirection}
        splitSize={frameTwoSize}
        onRemove={onRemoveFrameTwo}
      >
        {childArray?.[1]}
      </Frame>
    </Box>
  )
};
