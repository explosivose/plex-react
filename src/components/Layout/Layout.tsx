import { Box } from "@chakra-ui/react";
import React, { ComponentProps, ComponentType, FC } from "react";
import { EditModeProvider } from "./EditModeProvider";
import { Frame } from "./Frame";
import { ResizableSplit } from "./ResizableSplit";

export interface LayoutNode<C extends ComponentType<unknown> = FC<unknown>, P = ComponentProps<C>> {
  componentProps?: P;
  Component: C;
  id: number | string;
  childNodes?: LayoutNode[];
}

export const defaultLayout: LayoutNode[] = [{
  Component: ResizableSplit,
  id: "rootSplit",
  childNodes: [{
    Component: Frame,
    id: "frameOne"
  }, {
    Component: Frame,
    id: "frameTwo"
  }]
}];

const renderNodes = (nodes: LayoutNode[]) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map(({Component, componentProps, childNodes, id}) => {
    if (Component === null) {
      return null;
    }
    return (
      <Component key={id} {...componentProps}>
        {childNodes && renderNodes(childNodes)}
      </Component>
    )
  });
};

export interface LayoutProps {
  layout?: LayoutNode[];
}

export const Layout: FC<LayoutProps> = ({layout = defaultLayout}) => {
  return (
    <EditModeProvider>
      <Box width={"100vw"} height={"100vh"} id="layout-root">
        {renderNodes(layout)}
      </Box>
    </EditModeProvider>
  )
} 
