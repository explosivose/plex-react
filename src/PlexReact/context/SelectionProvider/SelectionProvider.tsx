import { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { usePlexData } from "../../hooks/usePlexData";
import { MetadataContainer } from "../../services/plex-api/response/library/metadata";

type TSelectionContext = [MetadataContainer | undefined, string, Dispatch<SetStateAction<string>>]

export const SelectionContext = createContext<TSelectionContext>([undefined, '', () => {
  throw new Error('SelectionProvider context used before initialized');
}]);

export const SelectionContextProvider: FC = (props) => {
  const [selectionKey, setSelectionKey] = useState('');

  const {
    data: selection
  } = usePlexData<MetadataContainer>(selectionKey);

  const memoizedContext = useMemo<TSelectionContext>(
    () => [selection, selectionKey, setSelectionKey],
    [selection, selectionKey, setSelectionKey]
  );
  return <SelectionContext.Provider {...props} value={memoizedContext} />
};
