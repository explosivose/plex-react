import logdown from "logdown";
import { generate as createId } from "short-uuid";
import { ComponentType, useContext, useMemo } from "react"
import { EditLayoutContext } from "../context/EditLayoutProvider"
import { getComponentFromRegister } from "../services/layoutRegistry";
import { LayoutTree, Serializable } from "../services/tree";

const logger = logdown('useConcreteLayout');

interface ConcreteLayoutNode {
  id: number | string;
  componentName: string;
  Component: ComponentType<unknown>;
  componentPath: number[];
  componentProps?: Record<string, Serializable>;
  childNodes?: (ConcreteLayoutNode)[]; 
}

export type ConcreteLayoutTree = (ConcreteLayoutNode)[];

const getConcreteLayout = (nodes: LayoutTree, path: number[]): ConcreteLayoutTree => {
  return nodes.map((node, i) => {
    const componentPath = path.concat(i);
    if (node === undefined) {
      // undefined nodes are placeholders in the tree
      // for example, ResizableSplit.childNodes = [undefined, Content]
      // frameTwo of ResizableSplit could be initialised before frameOne
      return {
        id: createId(),
        componentName: "undefined-placeholder",
        Component: () => <div />,
        componentPath
      };
    }
    const { id, componentName, componentProps, childNodes } = node;
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

export const useConcreteLayout = (): ReturnType<typeof getConcreteLayout> => {
  const [,, layout] = useContext(EditLayoutContext);
  const concreteLayout = useMemo(() => {
    return getConcreteLayout(layout, []);
  }, [layout]);
  return concreteLayout;
};
