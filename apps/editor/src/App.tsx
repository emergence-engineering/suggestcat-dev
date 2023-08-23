import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-suggestcat-plugin/dist/styles/styles.css";
import "prosemirror-suggestcat-plugin-react/dist/styles/styles.css";

import { exampleSetup } from "prosemirror-example-setup";
import {
  completePlugin,
  defaultOptions,
  grammarSuggestPlugin,
} from "prosemirror-suggestcat-plugin";
import styled from "@emotion/styled";
import { SlashMenuPlugin } from "prosemirror-slash-menu";
import {
  promptCommands,
  ProsemirrorSuggestcatPluginReact,
  slashOpeningCondition,
} from "prosemirror-suggestcat-plugin-react";
import { applyDevTools } from "prosemirror-dev-toolkit";

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StyledEditor = styled.div`
  width: 80%;
  margin-bottom: 0.625rem;

  .grammarSuggestion {
    background-color: lightgreen;
  }

  .removalSuggestion {
    background-color: lightcoral;
  }
`;

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
  ],
  type: "doc",
};

export const Editor: React.FunctionComponent = () => {
  // Needed for re-renders on every tr.
  const [editorState, setEditorState] = useState<EditorState>();
  const [editorView, setEditorView] = useState<EditorView>();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const state = EditorState.create({
      doc: schema.nodeFromJSON(initialDoc),
      plugins: [
        SlashMenuPlugin(promptCommands, undefined, slashOpeningCondition, true),
        ...exampleSetup({ schema }),
        grammarSuggestPlugin("-qKivjCv6MfQSmgF438PjEY7RnLfqoVe", {
          ...defaultOptions,
        }),
        completePlugin("-qKivjCv6MfQSmgF438PjEY7RnLfqoVe", {
          maxSelection: 2000,
        }),
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
    view.focus();
    return () => {
      view.destroy();
    };
  }, [editorRef]);

  const slashMenuPopperRef = useMemo(() => {
    if (!editorView || !editorView?.state) {
      return;
    }

    const currentNode = editorView.domAtPos(
      editorView.state.selection.to
    )?.node;

    if (!currentNode) {
      return;
    }

    if (currentNode instanceof Text) {
      return currentNode.parentElement;
    }

    return currentNode instanceof HTMLElement ? currentNode : undefined;
  }, [editorView?.state?.selection, window.scrollY]);

  return (
    <Root>
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
  );
};
