import React, { createContext, Dispatch, FC, useMemo, useReducer } from "react";
import { Frame } from "../Frame";
import { LayoutNode } from "../Layout";
import { registerComponent } from "../layoutRegistry";
import { ResizableSplit } from "../ResizableSplit";
import { Action } from "./actions";
import { reducer, State } from "./reducer";

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
const defaultState: State = {
  editModeEnabled: false,
  layout: defaultLayout,
}

const dummyActionDispatch = () => {
  throw new Error('EditLayoutContext used before initialized');
}

export const EditLayoutContext = createContext<[State, Dispatch<Action>]>([defaultState, dummyActionDispatch]);

export interface EditLayoutProviderProps {
  initialLayout?: LayoutNode[];
}

export const EditLayoutProvider: FC<EditLayoutProviderProps> = ({
  initialLayout = defaultLayout,
  ...props
}) => {
  const [config, updateConfig] = useReducer(reducer, {editModeEnabled: false, layout: initialLayout});
  const memoizedContext = useMemo<[State, Dispatch<Action>]>(() => [config, updateConfig], [config]);
  return <EditLayoutContext.Provider {...props} value={memoizedContext} />;
}
