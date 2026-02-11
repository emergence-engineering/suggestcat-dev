import React, { createContext, useContext, ReactNode } from "react";
import { EditorState, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export type ExampleType = "linkDetector" | "wordComplexity" | "sentenceLength" | "randomProcessor" | "grammarSuggestV2";

export interface ExampleConfig {
  id: ExampleType;
  label: string;
  key: PluginKey;
}

export interface EditorContextValue {
  editorView: EditorView | undefined;
  editorState: EditorState | undefined;
  selectedExample: ExampleType;
  setSelectedExample: (example: ExampleType) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  examples: ExampleConfig[];
  autoCompleteEnabled: boolean;
  setAutoCompleteEnabled: (enabled: boolean) => void;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  editorView: EditorView | undefined;
  editorState: EditorState | undefined;
  selectedExample: ExampleType;
  setSelectedExample: (example: ExampleType) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  examples: ExampleConfig[];
  autoCompleteEnabled: boolean;
  setAutoCompleteEnabled: (enabled: boolean) => void;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  editorView,
  editorState,
  selectedExample,
  setSelectedExample,
  isVisible,
  setIsVisible,
  examples,
  autoCompleteEnabled,
  setAutoCompleteEnabled,
}) => {
  const value: EditorContextValue = {
    editorView,
    editorState,
    selectedExample,
    setSelectedExample,
    isVisible,
    setIsVisible,
    examples,
    autoCompleteEnabled,
    setAutoCompleteEnabled,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
