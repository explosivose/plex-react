import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useReducer,
  useState
} from "react";
import { Action } from "./actions";
import { reducer, State } from "./reducer";
import { LayoutNode } from "../../services/tree";
import { LayoutComponent } from "../../services/layoutComponent.enum";

const defaultLayout: LayoutNode<LayoutComponent>[] = [{
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

type EditMode = [
  boolean, // editMode
  Dispatch<SetStateAction<boolean>>, // setEditMode
];

const dummyDispatch = () => {
  throw new Error('EditLayoutContext used before initialized');
};

const defaultEditMode: EditMode = [false, dummyDispatch];

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
};
