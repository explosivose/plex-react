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
  Component: ComponentType<LayoutNodeProps>;
  componentPath: number[];
  componentProps?: Record<string, Serializable>;
  childNodes?: ConcreteLayoutNode[]; 
}


const getConcreteLayout = (nodes: LayoutNode[], path: number[]): ConcreteLayoutNode[] => {
  return nodes.map(({id, componentName, componentProps, childNodes}, i) => {
    const componentPath = path.concat(i);
    return {
      id,
      componentName,
      componentPath,
      Component: getComponentFromRegister(componentName).Component,
      componentProps,
      childNodes: childNodes && getConcreteLayout(childNodes, path),
    }
  });
}

const renderNodes = (nodes: ConcreteLayoutNode[], parentIsLayoutComponent?: boolean) => {
  if (nodes === undefined) {
    return null;
  }
  return nodes.map(({Component, componentProps, childNodes, id, componentName, componentPath}) => {
    if (Component === null) {
      return null;
    }
    const renderComponent = () =>
      <Component key={id} layoutPath={componentPath} {...componentProps}>
        {childNodes && renderNodes(childNodes, isLayoutComponent(componentName))}
      </Component>
    // detect & wrap "naked" non-layout component i.e. one that 
    // is not parented by Frame (or ResizableSplit etc.)
    // otherwise the user loses control over this leaf of the layout tree
    if (!isLayoutComponent(componentName) && !parentIsLayoutComponent) {
      logger.debug(`layout create (and autowrap) ${id} (${componentName})`)
      return (
        <Frame>
          {renderComponent()}
        </Frame>
      )
    }
    logger.debug(`layout create ${id} (${componentName})`)
    return renderComponent();
  });
};


export const Layout: FC = () => {

  const [,,layout] = useContext(EditLayoutContext);

  const concreteLayout = useMemo(() => {
    return getConcreteLayout(layout, []);
  }, [layout]);

  return (
    <Box width={"100vw"} height={"100vh"} id="layout-root">
      {renderNodes(concreteLayout)}
    </Box>
  )
}