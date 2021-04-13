import { Box } from "@chakra-ui/react";
import React, { ComponentType, FC } from "react";
import { PlexReact } from "../PlexReact/PlexReact";
import { Frame } from "./Frame";
import { ResizableSplit } from "./ResizableSplit";

export interface LayoutNode<P = Record<string, unknown>, C extends ComponentType<P> = FC<P>> {
  componentProps?: P;
  Component: C;
  childNodes?: LayoutNode[];
}

export const defaultLayout: LayoutNode[] = [{
  Component: ResizableSplit,
  childNodes: [{
    Component: PlexReact
  }, {
    Component: Frame,
  }]
}];

const renderNodes = (nodes?: LayoutNode[]) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map(({Component, componentProps, childNodes}) => {
    if (Component === null) {
      return null;
    }
    return (
      <Component {...componentProps}>
        {renderNodes(childNodes)}
      </Component>
    )
  });
};

export interface LayoutProps {
  layout?: LayoutNode[];
}

export const Layout: FC<LayoutProps> = ({layout = defaultLayout}) => {

  return (
    <Box width={"100vw"} height={"100vh"} id="layout-root">
      {renderNodes(layout)}
    </Box>
  )
} 
