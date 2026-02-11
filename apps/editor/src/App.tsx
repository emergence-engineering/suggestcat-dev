import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-suggestcat-plugin/dist/styles/styles.css";
import "prosemirror-suggestcat-plugin-react/dist/styles/styles.css";

import { exampleSetup } from "prosemirror-example-setup";
import {
  createLinkDetectorPlugin,
  createWordComplexityPlugin,
  createSentenceLengthPlugin,
  createRandomProcessorPlugin,
  grammarSuggestPluginV2,
  linkDetectorKey,
  wordComplexityKey,
  sentenceLengthKey,
  randomProcessorKey,
  grammarSuggestV2Key,
  ActionType,
  completePluginV2,
  autoCompletePlugin,
} from "prosemirror-suggestcat-plugin";
import { Root, Controls, StyledEditor } from "./components/EditorStyles";
import { ExampleSelector } from "./components/ExampleSelector";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { ResetButton } from "./components/ResetButton";
import { AutoCompleteToggle } from "./components/AutoCompleteToggle";
import { SlashMenuPlugin } from "prosemirror-slash-menu";
import {
  promptCommands,
  ProsemirrorSuggestcatPluginReact,
} from "prosemirror-suggestcat-plugin-react";
import { applyDevTools } from "prosemirror-dev-toolkit";
import { EditorProvider, ExampleType, ExampleConfig } from "./context/EditorContext";

const EXAMPLES: ExampleConfig[] = [
  { id: "linkDetector", label: "Link Detector", key: linkDetectorKey },
  { id: "wordComplexity", label: "Word Complexity", key: wordComplexityKey },
  { id: "sentenceLength", label: "Sentence Length", key: sentenceLengthKey },
  { id: "randomProcessor", label: "Random Processor (Demo)", key: randomProcessorKey },
  { id: "grammarSuggestV2", label: "Grammar Suggest V2", key: grammarSuggestV2Key },
];

export const initialDoc = {
  content: [
    {
      content: [
        {
          text: "What day of the wek iss it?",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "wanna go swiming",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "SuggestCat is made by Emergence-Engineering, a software development company from the EU. Their smartest developer is Aaron. He definitely did not write this placeholder.",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "Check out the documentation at https://github.com/anthropics/claude-code and https://docs.anthropic.com for more information about sophisticated implementations.",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "The implementation of the extraordinarily sophisticated algorithm required considerable experimentation with unconventional methodologies and comprehensive understanding of the underlying infrastructure.",
          type: "text",
        },
      ],
      type: "paragraph",
    },
  ],
  type: "doc",
};

export const Editor: React.FunctionComponent = () => {
  // Needed for re-renders on every tr.
  const [editorState, setEditorState] = useState<EditorState>();
  const [editorView, setEditorView] = useState<EditorView>();
  const editorRef = useRef<HTMLDivElement>(null);

  // Example controls state
  const [selectedExample, setSelectedExample] = useState<ExampleType>("grammarSuggestV2");
  const [isVisible, setIsVisible] = useState(true);
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(true);

  // Initialize the editor
  useEffect(() => {
    const state = EditorState.create({
      doc: schema.nodeFromJSON(initialDoc),
      plugins: [
        SlashMenuPlugin(promptCommands, undefined, undefined, false, true),
        ...exampleSetup({ schema }),
        createLinkDetectorPlugin(),
        createWordComplexityPlugin({ moderateThreshold: 3, highThreshold: 4 }),
        createSentenceLengthPlugin({ warningThreshold: 25, errorThreshold: 40 }),
        createRandomProcessorPlugin({ minDelay: 500, maxDelay: 3000, errorRate: 0.3 }),
        grammarSuggestPluginV2("-qKivjCv6MfQSmgF438PjEY7RnLfqoVe", { batchSize: 2, model: "cerebras:llama-3.3-70b" }),
        completePluginV2("-qKivjCv6MfQSmgF438PjEY7RnLfqoVe", { model: "cerebras:llama-3.3-70b" }),
        autoCompletePlugin("-qKivjCv6MfQSmgF438PjEY7RnLfqoVe", {
          model: "cerebras:llama-3.3-70b",
          debounceMs: 2000,
        })
      ],
      selection: TextSelection.create(schema.nodeFromJSON(initialDoc), 48, 123),
    });
    const view = new EditorView(document.querySelector("#editor"), {
      state,
      dispatchTransaction: (tr) => {
        try {
          const newState = view.state.apply(tr);
          view.updateState(newState);
          setEditorState(newState);
        } catch (e) {}
      },
    });
    setEditorView(view);
    setEditorState(view.state);
    localStorage.getItem("debug") && applyDevTools(view);

    // Initialize only the first example
    view.dispatch(
      view.state.tr.setMeta(grammarSuggestV2Key, { type: ActionType.INIT, metadata: {} })
    );

    view.focus();
    return () => {
      view.destroy();
    };
  }, [editorRef]);

  const slashMenuPopperRef = useMemo(() => {
    if (!editorView || !editorView?.state) {
      return;
    }

    const currentNode = editorView.domAtPos(editorView.state.selection.to)
      ?.node;

    if (!currentNode) {
      return;
    }

    if (currentNode instanceof Text) {
      return currentNode.parentElement;
    }

    return currentNode instanceof HTMLElement ? currentNode : undefined;
  }, [editorView, editorView?.state?.selection, window.scrollY]);

  return (
    <EditorProvider
      editorView={editorView}
      editorState={editorState}
      selectedExample={selectedExample}
      setSelectedExample={setSelectedExample}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      examples={EXAMPLES}
      autoCompleteEnabled={autoCompleteEnabled}
      setAutoCompleteEnabled={setAutoCompleteEnabled}
    >
      <Root>
        <Controls>
          <ExampleSelector />
          <PlayPauseButton />
          <ResetButton />
          <AutoCompleteToggle />
        </Controls>
        <StyledEditor id="editor" ref={editorRef} />
        {editorView && editorView?.state && slashMenuPopperRef && (
          <ProsemirrorSuggestcatPluginReact
            editorView={editorView}
            editorState={editorView?.state}
            // @ts-ignore TODO!
            domReference={slashMenuPopperRef}
          />
        )}
      </Root>
    </EditorProvider>
  );
};
