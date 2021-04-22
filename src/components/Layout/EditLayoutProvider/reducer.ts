import logdown from "logdown";
import { generate as createId } from "short-uuid";
import { LayoutNode, LayoutTree, Serializable } from "../Layout";
import { isComponentRegistered } from "../layoutRegistry";
import { Action, ActionType } from "./actions"
import { getNodeAtPath, removeNode, replaceNode } from "./tree";

const logger = logdown("layout/editLayoutReducer");

export type State = LayoutTree;


interface ReplaceNodeWithPathOptions {
  tree: Readonly<LayoutTree>;
  replaceAtPath: number[];
  replaceWithPath: number[]
  removeChildNodes?: boolean;
}

const replaceNodeWithPath = ({
  tree,
  replaceAtPath,
  replaceWithPath,
  removeChildNodes
}: ReplaceNodeWithPathOptions): LayoutTree => {
  const replacement = getNodeAtPath(replaceWithPath, tree);
  const newTree = [...tree];
  if (replacement) {
    logger.debug(`replaceNodeWithPath: Replacing with ${replacement.id} ${replacement.componentName}`)
    replaceNode({
      tree: newTree,
      replaceAtPath,
      replacement: {
        ...replacement,
        childNodes: removeChildNodes
          ? undefined
          : replacement.childNodes,
      }
    });
  } else {
    logger.debug(`replaceNodeWithPath: No replacement at ${replaceWithPath}. Replacing with nothing (removing).`);
    removeNode({
      tree: newTree,
      removeAtPath: replaceAtPath,
    });
  }
  return newTree;
}

interface ReplaceNodeWithComponent {
  tree: Readonly<LayoutTree>;
  replaceAtPath: number[];
  replacementName: string;
  replacementProps?: Record<string, Serializable>;
  replacementId?: number | string;
  /**
   * Reattach the replaced node as a child of the replacement node at index.
   * This option overrides removeChildNodes
   */
  reattachAsChild?: number;
  /**
   * If true, adopt the childNodes from the replaced node.
   */
  adoptChildNodes?: boolean;
}

const replaceNodeWithComponent = ({
  tree,
  replaceAtPath,
  replacementName,
  replacementProps,
  replacementId,
  adoptChildNodes,
  reattachAsChild
}: ReplaceNodeWithComponent): LayoutTree => {
  if (!isComponentRegistered(replacementName)) {
    logger.error(`Aborting layout edit because component replacement is not registered ${replacementName}`);
    return [...tree];
  }
  logger.debug('replaceNodeWithComponent', replaceAtPath);
  const toReplace = getNodeAtPath(replaceAtPath, tree);
  let replacement: LayoutNode;
  if (toReplace === undefined) {
    logger.debug(`Nothing to replace at ${replaceAtPath}. Adding new item.`);
    replacement = {
      id: replacementId ?? `${replacementName}-${createId()}`,
      componentName: replacementName,
      componentProps: replacementProps,
    };
  } else {
    let childNodes: LayoutTree | undefined;
    logger.debug(`Replaced node: `, toReplace)
    if (reattachAsChild !== undefined) {
      logger.debug(`Reattaching node as a child of the replacement node`)
      // if we are to reattach the replaced node as a child
      childNodes = [];
      // back-fill the empty indexes 
      for (let i = 0; i < reattachAsChild; i++) {
        childNodes.push(undefined);
      }
      // assign as child at the desired position in child array
      childNodes[reattachAsChild] = { ...toReplace };
    } else if (adoptChildNodes) {
      logger.debug(`Adopting children of replaced node.`)
      // adopt children from replaced node
      childNodes = toReplace.childNodes ? [ ...toReplace.childNodes ] : undefined;
    }

    replacement = {
      id: replacementId ?? `${replacementName}-${createId()}`,
      componentName: replacementName,
      componentProps: replacementProps,
      childNodes
    };
  }
  const newTree = [...tree];
  replaceNode({
    tree: newTree,
    replaceAtPath,
    replacement
  });
  return newTree;
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
        replacementProps: action.replacementProps,
        replacementId: action.replacementId,
        adoptChildNodes: action.adoptChildNodes,
        reattachAsChild: action.reattachAsChild
      })];
    }
    case ActionType.RemoveNode: {
      logger.debug("Removing node in layout.");
      logger.error("Modified using non-pure reducer. Expect problems!");
      // FIXME removeNode() is not a pure function because it modifies the tree argument directly
      // reducers must be pure functions 
      removeNode({tree: state, removeAtPath: action.removeAtPath});
      return [...state];
    }
    default: {
      const type = (action as {type: unknown}).type
      throw new Error (`EditLayout Reducer encountered unexpected action (${type})`);
    }
  }
};
