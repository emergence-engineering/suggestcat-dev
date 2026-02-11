import React, { useCallback } from "react";
import { pauseRunner, resumeRunner } from "prosemirror-suggestcat-plugin";
import { useEditor } from "../context/EditorContext";
import { Button } from "./EditorStyles";

export const PlayPauseButton: React.FC = () => {
  const {
    editorView,
    selectedExample,
    isVisible,
    setIsVisible,
    examples,
  } = useEditor();

  const handleToggleVisibility = useCallback(() => {
    if (!editorView) return;

    const currentKey = examples.find((ex) => ex.id === selectedExample)?.key;
    if (!currentKey) return;

    if (isVisible) {
      pauseRunner(editorView, currentKey);
    } else {
      resumeRunner(editorView, currentKey);
    }

    setIsVisible(!isVisible);
  }, [editorView, selectedExample, isVisible, setIsVisible, examples]);

  return (
    <Button
      onClick={handleToggleVisibility}
      active={isVisible}
      title={isVisible ? "Pause (hide decorations)" : "Play (show decorations)"}
    >
      {isVisible ? "\u23F8" : "\u25B6"}
    </Button>
  );
};
