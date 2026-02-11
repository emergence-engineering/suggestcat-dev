import React, { useCallback } from "react";
import { ActionType } from "prosemirror-suggestcat-plugin";
import { useEditor } from "../context/EditorContext";
import { Button } from "./EditorStyles";

export const ResetButton: React.FC = () => {
  const {
    editorView,
    selectedExample,
    isVisible,
    examples,
  } = useEditor();

  const handleReset = useCallback(() => {
    if (!editorView) return;

    const currentKey = examples.find((ex) => ex.id === selectedExample)?.key;
    if (!currentKey) return;

    // Clear and re-initialize
    editorView.dispatch(
      editorView.state.tr.setMeta(currentKey, { type: ActionType.CLEAR })
    );

    if (isVisible) {
      // Small delay to ensure clear is processed
      setTimeout(() => {
        editorView.dispatch(
          editorView.state.tr.setMeta(currentKey, { type: ActionType.INIT, metadata: {} })
        );
      }, 10);
    }
  }, [editorView, selectedExample, isVisible, examples]);

  return (
    <Button onClick={handleReset} title="Reset">
      {"\u23F9"}
    </Button>
  );
};
