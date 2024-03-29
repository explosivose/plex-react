import logdown from "logdown";
import { ComponentProps, ComponentType } from "react";
import { LayoutComponent } from "./layoutComponent.enum";

const logger = logdown("layout/tree");

export type Serializable = string | number | boolean | undefined;
type ExtractByType<T, U> = {
  [P in keyof T]: Extract<T[P], U>
}
export type SimpleProps<C extends ComponentType> = 
  ExtractByType<ComponentProps<C>, Serializable>

export interface LayoutNode<K extends string = string> {
  id: number | string;
  componentName: K;
  componentProps?: Record<string, Serializable>;
  childNodes?: (LayoutNode<K> | undefined)[];
}

export type LayoutTree<K extends string = string> = (LayoutNode<K> | undefined)[];

export const getNodeAtPath = (path: number[], tree?: Readonly<LayoutTree>): Readonly<LayoutNode> | undefined => {
  // logger.debug('getNodeAtPath', path, tree);
  if (tree === undefined) {
    // we either hit an implicit Frame or a non-existant part of the tree
    return undefined;
  }
  if (path.length === 1) {
    return tree[path[0]];
  } else {
    return getNodeAtPath(path.slice(1), tree[path[0]]?.childNodes);
  }
};

interface ReplaceNodeOptions {
  tree: LayoutTree;
  replaceAtPath: number[];
  replacement: LayoutNode;
}

export const replaceNode = ({
  tree,
  replaceAtPath,
  replacement
}: ReplaceNodeOptions): LayoutTree => {
  // logger.debug('replaceNode', tree, replaceAtPath, replacement);
  if (replacement.componentName === LayoutComponent.Frame) {
    // frames are implicit components that shouldn't appear in the tree
    logger.warn('replaceNode: Adding Frame node to tree!');
  }
  if (replaceAtPath.length === 1) {
    tree[replaceAtPath[0]] = replacement
    return tree;
  } else {
    const nextNode = tree[replaceAtPath[0]];
    if (nextNode?.childNodes) {
      return replaceNode({
        tree: nextNode.childNodes,
        replaceAtPath: replaceAtPath.slice(1),
        replacement
      });
    } else {
      if (nextNode === undefined || replaceAtPath.length > 2) {
        // We are not at the end of the replaceAtPath yet. The only undefined nodes
        // in the tree are leafs, so there should be a node here.
        logger.error('replaceNode: Traversed to non-existant part of layout tree');
      } else {
        // Found a node without children on the replaceAtPath.
        // This is allowed if we are 2 steps away from a leaf.
        // This can happen for example when we have an empty ResizableSplit[,]
        // (which has implicit Frame components in the tree)
        // In this case we will create the childNodes array. 
        logger.debug('repladeNode: creating childNodes')
        const createAtPath = replaceAtPath.slice(1);
        nextNode.childNodes = [];
        // back-fill any undefined children that come before this replacement
        // e.g. nextNode.childNodes = [undefined, replacement]
        // ensures that the replacement is added at the correct position
        for (let i = 0; i < createAtPath[0]; i++) {
          nextNode.childNodes.push(undefined);
        }
        nextNode.childNodes[createAtPath[0]] = replacement;
      }
      return tree;
    }
  }
};

interface RemoveNodeOptions {
  tree: LayoutTree;
  removeAtPath: number[];
}

export const removeNode = ({
  tree,
  removeAtPath
}: RemoveNodeOptions): LayoutTree => {
  logger.debug('removeNode', tree, removeAtPath);
  if (removeAtPath.length === 1) {
    // assign undefined to remove
    // do not splice or remove entries because this will upset the
    // order of nodes in the tree
    tree[removeAtPath[0]] = undefined;
    return tree;
  } else {
    const nextNode = tree[removeAtPath[0]];
    if (nextNode?.childNodes) {
      return removeNode({
        tree: nextNode.childNodes,
        removeAtPath: removeAtPath.slice(1)
      });
    } else {
      logger.error('removeNode: Traversed to non-existant part of layout tree');
      return []
    }
  }
};

