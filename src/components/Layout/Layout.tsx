import { Box } from "@chakra-ui/react";
import logdown from "logdown";
import React, { ComponentProps, ComponentType, FC, useContext, useMemo } from "react";
import { EditLayoutContext, isLayoutComponent } from "./EditLayoutProvider";
import { Frame } from "./Frame";
import { getComponentFromRegister } from "./layoutRegistry";

const logger = logdown('layout/layout');

type Serializable = string | number | boolean | undefined;
type ExtractByType<T, U> = {
  [P in keyof T]: Extract<T[P], U>
}
export type SimpleProps<C extends ComponentType> = 
  ExtractByType<ComponentProps<C>, Serializable>

export interface LayoutNodeProps {
  layoutPath?: number[];
  editable?: boolean;
  editableChildren?: boolean[];
}

export interface LayoutNode<K extends string = string> {
  id: number | string;
  componentName: K;
  componentProps?: Record<string, Serializable>;
  childNodes?: LayoutNode<K>[];
}

interface ConcreteLayoutNode {
  id: number | string;
  componentName: string;
  Component: ComponentType<unknown>;
  componentPath: number[];
  componentProps?: Record<string, Serializable>;
  childNodes?: ConcreteLayoutNode[]; 
}


const getConcreteLayout = (nodes: LayoutNode[], path: number[]): ConcreteLayoutNode[] => {
  return nodes.map(({id, componentName, componentProps, childNodes}, i) => {
    const componentPath = path.concat(i);
    logger.debug(id, componentName, componentPath);
    return {
      id,
      componentName,
      componentPath,
      Component: getComponentFromRegister(componentName).Component,
      componentProps,
      childNodes: childNodes && getConcreteLayout(childNodes, componentPath),
    }
  });
}

const renderNodes = (nodes: ConcreteLayoutNode[], parentIsLayoutComponent?: boolean) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map((node) => {
    const { Component, componentName, id, childNodes, componentPath, componentProps } = node;  
    if (Component === null) {
      return null;
    }
    const isLeaf = (n: ConcreteLayoutNode) => n.childNodes === undefined;
    const nodeIsLeaf = isLeaf(node);
    // 'why not assign isLayoutComponent to a variable?'
    // because the compiler doesn't infer the type with this typeguard unless it is inside the if-statement
    if (isLayoutComponent(Component, componentName)) {
      logger.debug(`layout create layoutComponent ${id} (${componentName}, editable=${nodeIsLeaf})`);
      return (
        <Component
          key={id}
          layoutPath={componentPath} 
          editable={nodeIsLeaf}
          editableChildren={node.childNodes?.map(n => isLeaf(n) && !isLayoutComponent(n.Component, n.componentName))}
        >
          {childNodes && renderNodes(childNodes, /*isLayoutComponent=*/ true)}
        </Component>
      );
    } else if (parentIsLayoutComponent) {
      logger.debug(`layout create content ${id} (${componentName}, editable=${nodeIsLeaf})`);
      return (
        <Component key={id}>
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

  const [,,layout] = useContext(EditLayoutContext);

  const concreteLayout = useMemo(() => {
    return getConcreteLayout(layout, []);
  }, [layout]);
  
  logger.debug(layout);
  logger.debug(concreteLayout);

  return (
    <Box width={"100vw"} height={"100vh"} id="layout-root">
      {renderNodes(concreteLayout)}
    </Box>
  )
}