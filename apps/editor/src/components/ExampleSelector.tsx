import React, { useCallback } from "react";
import { ActionType } from "prosemirror-suggestcat-plugin";
import { useEditor, ExampleType } from "../context/EditorContext";
import { Select } from "./EditorStyles";

export const ExampleSelector: React.FC = () => {
  const {
    editorView,
    selectedExample,
    setSelectedExample,
    isVisible,
    examples,
  } = useEditor();

  const handleExampleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newExample = e.target.value as ExampleType;
      if (!editorView || newExample === selectedExample) return;

      // Clear all examples first
      let tr = editorView.state.tr;
      examples.forEach(({ key }) => {
        tr = tr.setMeta(key, { type: ActionType.CLEAR });
      });
      editorView.dispatch(tr);

      // Initialize the new example if visible
      if (isVisible) {
        const newKey = examples.find((ex) => ex.id === newExample)?.key;
        if (newKey) {
          editorView.dispatch(
            editorView.state.tr.setMeta(newKey, { type: ActionType.INIT, metadata: {} })
          );
        }
      }

      setSelectedExample(newExample);
    },
    [editorView, selectedExample, isVisible, examples, setSelectedExample]
  );

  return (
    <Select value={selectedExample} onChange={handleExampleChange}>
      {examples.map((ex) => (
        <option key={ex.id} value={ex.id}>
          {ex.label}
        </option>
      ))}
    </Select>
  );
};
