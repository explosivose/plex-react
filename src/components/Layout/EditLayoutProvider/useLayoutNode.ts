import { useContext } from "react"
import { EditLayoutContext } from "."
import { getNodeAtPath } from "./tree";

export const useLayoutNode = (layoutPath: number[]): ReturnType<typeof getNodeAtPath> => {
  const [,, layout] = useContext(EditLayoutContext);
  return getNodeAtPath(layoutPath, layout);
}
