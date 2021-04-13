
import logdown from "logdown";
import React, { createContext, FC, useCallback, useMemo, useState } from "react";

const logger = logdown('plex-react:layout/editModeProvider');

interface EditMode {
  editModeEnabled: boolean;
  setEnabled: (en?: boolean) => void;
}

const defaultEditMode: EditMode = {
  editModeEnabled: false,
  setEnabled: function() {return;},
}

export const EditModeContext = createContext<EditMode>(defaultEditMode);

export const EditModeProvider: FC = (props) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  // create callback which accepts optional value
  const setEnabled = useCallback((en?: boolean) => {
    logger.debug('Edit Mode: ', en === true);
    setEditModeEnabled(en === true);
  }, []);
  // create memoized editMode context
  const editModeContext = useMemo<EditMode>(() => ({
    editModeEnabled,
    setEnabled
  }), [editModeEnabled, setEnabled]);
  // provide memoized editMode context
  return <EditModeContext.Provider {...props} value={editModeContext} />
};
