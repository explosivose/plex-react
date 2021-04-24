import { useContext } from "react"
import { EditLayoutContext } from "../context/EditLayoutProvider"
import { getNodeAtPath } from "../services/tree";

export const useLayoutNode = (layoutPath: number[]): ReturnType<typeof getNodeAtPath> => {
  const [,, layout] = useContext(EditLayoutContext);
  return getNodeAtPath(layoutPath, layout);
}
