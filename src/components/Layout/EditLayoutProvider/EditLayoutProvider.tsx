import React, {
  ComponentType,
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useReducer,
  useState
} from "react";
import { Frame } from "../Frame";
import { LayoutNode, LayoutNodeProps } from "../Layout";
import { registerComponent } from "../layoutRegistry";
import { ResizableSplit } from "../ResizableSplit";
import { Action } from "./actions";
import { reducer, State } from "./reducer";

export enum LayoutComponent {
  ResizableSplit = "ResizableSplit",
  Frame = "Frame",
}

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

type EditMode = [
  boolean, // editMode
  Dispatch<SetStateAction<boolean>>, // setEditMode
]

registerComponent(ResizableSplit, LayoutComponent.ResizableSplit);
registerComponent(Frame, LayoutComponent.Frame);

const dummyDispatch = () => {
  throw new Error('EditLayoutContext used before initialized');
};

const defaultEditMode: EditMode = [
  false,
  dummyDispatch
]

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


export const EditLayoutContext =
  createContext<[Dispatch<Action>, EditMode, State]>([dummyDispatch, defaultEditMode, defaultLayout]);

export interface EditLayoutProviderProps {
  initialLayout?: LayoutNode[];
}

export const EditLayoutProvider: FC<EditLayoutProviderProps> = ({
  initialLayout = defaultLayout,
  ...props
}) => {
  const editMode = useState(false);
  const [config, updateConfig] = useReducer(reducer, initialLayout);
  const memoizedContext = useMemo<[Dispatch<Action>, EditMode, State]>(() => {
    return [updateConfig, editMode, config]
  }, [config, editMode]);
  return <EditLayoutContext.Provider {...props} value={memoizedContext} />;
}
