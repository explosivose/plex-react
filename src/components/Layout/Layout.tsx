import { Box } from "@chakra-ui/react";
import logdown from "logdown";
import React, { ComponentProps, ComponentType, FC, useMemo } from "react";
import { Frame } from "./Frame";
import { getComponentFromRegister, registerComponent } from "./layoutRegistry";
import { ResizableSplit } from "./ResizableSplit";

const logger = logdown('layout/layout');

type Serializable = string | number | boolean | undefined;
type ExtractByType<T, U> = {
  [P in keyof T]: Extract<T[P], U>
}
export type SimpleProps<C extends ComponentType> = 
  ExtractByType<ComponentProps<C>, Serializable>

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
  componentProps?: Record<string, Serializable>;
  childNodes?: ConcreteLayoutNode[]; 
}

export enum LayoutComponent {
  ResizableSplit = "ResizableSplit",
  Frame = "Frame",
}

registerComponent(ResizableSplit, LayoutComponent.ResizableSplit);
registerComponent(Frame, LayoutComponent.Frame);

export const defaultLayout: LayoutNode<LayoutComponent>[] = [{
  id: "rootSplit",
  componentName: LayoutComponent.ResizableSplit,
  childNodes: [{
    componentName: LayoutComponent.Frame,
    id: "frameOne"
  }, {
    componentName: LayoutComponent.Frame,
    id: "frameTwo"
  }]
}];

const getConcreteLayout = (nodes: LayoutNode[]): ConcreteLayoutNode[] => {
  return nodes.map(({id, componentName, componentProps, childNodes}) => {
    return {
      id,
      componentName,
      Component: getComponentFromRegister(componentName).Component,
      componentProps,
      childNodes: childNodes && getConcreteLayout(childNodes)
    }
  });
}

const renderNodes = (nodes: ConcreteLayoutNode[]) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map(({Component, componentProps, childNodes, id, componentName}) => {
    if (Component === null) {
      return null;
    }
    logger.debug('layout create ', componentName);
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

  const concreteLayout = useMemo(() => {
    return getConcreteLayout(layout);
  }, [layout]);

  return (
    <Box width={"100vw"} height={"100vh"} id="layout-root">
      {renderNodes(concreteLayout)}
    </Box>
  )
}