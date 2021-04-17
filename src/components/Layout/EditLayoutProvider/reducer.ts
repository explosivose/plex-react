import logdown from "logdown";
import { LayoutNode } from "../Layout";
import { isComponentRegistered } from "../layoutRegistry";
import { Action, ActionType } from "./actions"

const logger = logdown("layout/editLayoutReducer");

export type State = LayoutNode[];

const getNodeAtPath = (path: number[], tree?: LayoutNode[]): LayoutNode | undefined => {
  logger.debug('getNodeAtPath', path, tree);
  if (tree === undefined) {
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
  if (replaceAtPath.length === 1) {
    tree[replaceAtPath[0]] = replacement
    return tree;
  } else {
    const nextTree = tree[replaceAtPath[0]];
    if (nextTree.childNodes) {
      return replaceNode({
        tree: nextTree.childNodes,
        replaceAtPath: replaceAtPath.slice(1),
        replacement
      })
    } else {
      logger.error('Traversed to non-existant part of layout tree');
      return [];
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
    return replaceNode({
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
    logger.error(`Error in layout tree replaceNodeWithPath(): could not find replacement at ${replaceWithPath}`);
    return tree;
  }
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
  const toRemove = getNodeAtPath(replaceAtPath);
  if (toRemove === undefined) {
    logger.error(`Error in layout tree replaceNodeWithComponent: could not find path to replace at ${replaceAtPath}`);
    return tree;
  } else {
    const replacement: LayoutNode = {
      id: replacementId ?? toRemove.id,
      componentName: replacementName,
      childNodes: removeChildNodes
        ? undefined
        : toRemove.childNodes
    }
    return replaceNode({
      tree,
      replaceAtPath,
      replacement
    });
  }
}


export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ReplaceNodeWithPath: {
      logger.debug("Replacing node in layout with path", state);
      const result = [...replaceNodeWithPath({
        tree: state,
        replaceAtPath: action.replaceAtPath,
        replaceWithPath: action.replaceWithPath,
        removeChildNodes: action.removeChildNodes
      })];
      logger.debug("Replacement result", result === state, result);
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
    default: {
      const type = (action as {type: unknown}).type
      throw new Error (`EditLayout Reducer encountered unexpected action (${type})`);
    }
  }
};