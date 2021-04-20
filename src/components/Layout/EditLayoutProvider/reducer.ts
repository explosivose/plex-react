import logdown from "logdown";
import { generate as createId } from "short-uuid";
import { LayoutNode } from "../Layout";
import { isComponentRegistered } from "../layoutRegistry";
import { Action, ActionType } from "./actions"
import { LayoutComponent } from "./EditLayoutProvider";

const logger = logdown("layout/editLayoutReducer");

export type State = LayoutNode[];

const getNodeAtPath = (path: number[], tree?: LayoutNode[]): LayoutNode | undefined => {
  logger.debug('getNodeAtPath', path, tree);
  if (tree === undefined) {
    // we either hit an implicit Frame or a non-existant part of the tree
    return undefined;
  }
  if (path.length === 1) {
    return tree[path[0]];
  } else {
    return getNodeAtPath(path.slice(1), tree[path[0]].childNodes);
  }
}

interface ReplaceNodeOptions {
  tree: LayoutNode[];
  replaceAtPath: number[];
  replacement: LayoutNode;
}

const replaceNode = ({
  tree,
  replaceAtPath,
  replacement
}: ReplaceNodeOptions): LayoutNode[] => {
  logger.debug('replaceNode', tree, replaceAtPath, replacement);
  if (replacement.componentName === LayoutComponent.Frame) {
    // frames are implicit components that shouldn't appear in the tree
    logger.warn('Adding Frame node to tree!');
  }
  if (replaceAtPath.length === 1) {
    tree[replaceAtPath[0]] = replacement
    return tree;
  } else {
    const nextNode = tree[replaceAtPath[0]];
    if (nextNode.childNodes) {
      return replaceNode({
        tree: nextNode.childNodes,
        replaceAtPath: replaceAtPath.slice(1),
        replacement
      });
    } else {
      logger.error('replaceNode: Traversed to non-existant part of layout tree');
      // FIXME
      // we can find ourselves in a situation where we are adding to an implicit Frame
      // and this implicit Frame may not be the first or only implicit child of the
      // nextNode. How can we insert into the tree [undefined, replacement]?
      // This happens when we have an empty ResizableSplit [,]
      // And the second implicit Frame tries to add content before the first
      // [undefined, replacement]
      // nextNode.childNodes = [undefined, replacement];
      return tree;
    }
  }
}

interface RemoveNodeOptions {
  tree: LayoutNode[];
  removeAtPath: number[];
}

const removeNode = ({
  tree,
  removeAtPath
}: RemoveNodeOptions): LayoutNode[] => {
  logger.debug('removeNode', tree, removeAtPath);
  if (removeAtPath.length === 1) {
    return tree.splice(removeAtPath[0], 1);
  } else {
    const nextNode = tree[removeAtPath[0]];
    if (nextNode.childNodes) {
      return removeNode({
        tree: nextNode.childNodes,
        removeAtPath: removeAtPath.slice(1)
      });
    } else {
      logger.error('removeNode: Traversed to non-existant part of layout tree');
      return []
    }
  }
}

interface ReplaceNodeWithPathOptions {
  tree: LayoutNode[];
  replaceAtPath: number[];
  replaceWithPath: number[]
  removeChildNodes?: boolean;
}

const replaceNodeWithPath = ({
  tree,
  replaceAtPath,
  replaceWithPath,
  removeChildNodes
}: ReplaceNodeWithPathOptions): LayoutNode[] => {
  const replacement = getNodeAtPath(replaceWithPath, tree);
  if (replacement) {
    logger.debug(`Replacing with ${replacement.id} ${replacement.componentName}`)
    replaceNode({
      tree,
      replaceAtPath,
      replacement: {
        ...replacement,
        childNodes: removeChildNodes
          ? undefined
          : replacement.childNodes,
      }
    });
  } else {
    logger.debug(`No replacement at ${replaceWithPath}. Replacing with nothing (removing).`);
    removeNode({
      tree,
      removeAtPath: replaceAtPath,
    });
  }
  return tree;
}

interface ReplaceNodeWithComponent {
  tree: LayoutNode[];
  replaceAtPath: number[];
  replacementName: string;
  replacementId?: number | string;
  removeChildNodes?: boolean;
}

const replaceNodeWithComponent = ({
  tree,
  replaceAtPath,
  replacementName,
  replacementId,
  removeChildNodes
}: ReplaceNodeWithComponent): LayoutNode[] => {
  if (!isComponentRegistered(replacementName)) {
    logger.error(`Aborting layout edit because component replacement is not registered ${replacementName}`);
    return tree;
  }
  logger.debug('replaceNodeWithComponent', replaceAtPath);
  const toRemove = getNodeAtPath(replaceAtPath, tree);
  let replacement: LayoutNode;
  if (toRemove === undefined) {
    logger.debug(`Nothing to replace at ${replaceAtPath}. Adding new item.`);
    replacement = {
      id: replacementId ?? `${replacementName}-${createId()}`,
      componentName: replacementName,
    };
  } else {
    logger.debug('toRemove', toRemove.id, toRemove.componentName);
    replacement = {
      id: replacementId ?? toRemove.id,
      componentName: replacementName,
      childNodes: removeChildNodes
        ? undefined
        : toRemove.childNodes
    };
  }
  replaceNode({
    tree,
    replaceAtPath,
    replacement
  });
  return tree;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ReplaceNodeWithPath: {
      logger.debug("Replacing node in layout with path");
      const result = [...replaceNodeWithPath({
        tree: state,
        replaceAtPath: action.replaceAtPath,
        replaceWithPath: action.replaceWithPath,
        removeChildNodes: action.removeChildNodes
      })];
      return result;
    }
    case ActionType.ReplaceNodeWithComponent: {
      logger.debug("Replacing node in layout with component");
      return [...replaceNodeWithComponent({
        tree: state,
        replaceAtPath: action.replaceAtPath,
        replacementName: action.replacementName,
        replacementId: action.replacementId
      })];
    }
    case ActionType.RemoveNode: {
      logger.debug("Removing node in layout.");
      removeNode({tree: state, removeAtPath: action.removeAtPath});
      return [...state];
    }
    default: {
      const type = (action as {type: unknown}).type
      throw new Error (`EditLayout Reducer encountered unexpected action (${type})`);
    }
  }
};
