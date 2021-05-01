import { Box } from "@chakra-ui/react";
import logdown from "logdown";
import React, { ComponentType, FC } from "react";
import { Frame } from "./components/Frame";
import { ResizableSplit } from "./components/ResizableSplit";
import { ConcreteLayoutTree, useConcreteLayout } from "./hooks/useConcreteLayout";
import { LayoutComponent } from "./services/layoutComponent.enum";
import { registerComponent } from "./services/layoutRegistry";

const logger = logdown('layout/layout');

export interface LayoutNodeProps {
  layoutPath?: number[];
  editable?: boolean;
  editableChildren?: boolean[];
}

registerComponent(ResizableSplit, LayoutComponent.ResizableSplit);
registerComponent(Frame, LayoutComponent.Frame);

export const isLayoutComponent = (
  component: unknown,
  componentName: string
): component is ComponentType<LayoutNodeProps> => {
  const layoutComponents = [
    LayoutComponent.Frame,
    LayoutComponent.ResizableSplit
  ] as string[];
  return layoutComponents.includes(componentName);
};

const renderNodes = (nodes: ConcreteLayoutTree, parentIsLayoutComponent?: boolean) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map((node) => {
    const { Component, componentName, id, childNodes, componentPath, componentProps } = node;  
    if (Component === null) {
      return null;
    }
    const isLeaf = (n: typeof nodes[0]) => n.childNodes === undefined;
    const nodeIsLeaf = isLeaf(node);
    // 'why not assign result of  isLayoutComponent() to a variable?'
    // because the compiler doesn't infer the type with this typeguard unless it is inside the if-statement
    if (isLayoutComponent(Component, componentName)) {
      logger.debug(`layout create layoutComponent ${id} (${componentName}, editable=${nodeIsLeaf})`);
      return (
        <Component
          {...componentProps}
          key={id}
          layoutPath={componentPath} 
          editable={nodeIsLeaf}
          // TODO reassess this code ...
          // is the intention clear here? is the implementation solid?
          editableChildren={node.childNodes?.map(n =>
            n === undefined || (isLeaf(n) && !isLayoutComponent(n.Component, n.componentName)))}
        >
          {childNodes && renderNodes(childNodes, /*isLayoutComponent=*/ true)}
        </Component>
      );
    } else if (parentIsLayoutComponent) {
      logger.debug(`layout create content ${id} (${componentName}, editable=${nodeIsLeaf})`);
      return (
        <Component {...componentProps} key={id}>
          {childNodes && renderNodes(childNodes, /*isLayoutComponent=*/ false)}
        </Component>
      );
    } else {
      logger.debug(`layout create & wrap content ${id} (${componentName}, editable=${nodeIsLeaf})`);
      // detect & wrap "naked" non-layout component i.e. one that 
      // is not parented by Frame (or ResizableSplit etc.)
      // otherwise the user loses control over this leaf of the layout tree
      return (
        <Frame key={id} layoutPath={componentPath} editable={nodeIsLeaf}>
          <Component {...componentProps}>
            {childNodes && renderNodes(childNodes, isLayoutComponent(Component, componentName))}
          </Component>
        </Frame>
      );
    }
  });
};

export const Layout: FC = () => {

  const concreteLayout = useConcreteLayout();

  return (
    <Box width={"100vw"} height={"100vh"} id="layout-root">
      {renderNodes(concreteLayout)}
    </Box>
  )
};
