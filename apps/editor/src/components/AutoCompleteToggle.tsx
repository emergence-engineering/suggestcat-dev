import React, { useCallback } from "react";
import { setAutoCompleteEnabled } from "prosemirror-suggestcat-plugin";
import { useEditor } from "../context/EditorContext";
import { Button } from "./EditorStyles";

export const AutoCompleteToggle: React.FC = () => {
  const { editorView, autoCompleteEnabled, setAutoCompleteEnabled: setEnabled } = useEditor();

  const handleToggle = useCallback(() => {
    if (!editorView) return;
    const newState = !autoCompleteEnabled;
    setAutoCompleteEnabled(editorView, newState);
    setEnabled(newState);
  }, [editorView, autoCompleteEnabled, setEnabled]);

  return (
    <Button
      onClick={handleToggle}
      active={autoCompleteEnabled}
      title={autoCompleteEnabled ? "Disable AI Completions" : "Enable AI Completions"}
    >
      💡
    </Button>
  );
};
