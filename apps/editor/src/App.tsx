import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-suggestcat-plugin/dist/styles/styles.css";
import "prosemirror-suggestcat-plugin-react/dist/styles/styles.css";

import { exampleSetup } from "prosemirror-example-setup";
import {
  completePlugin,
  completePluginKey,
  defaultOptions,
  grammarSuggestPlugin,
  Status,
} from "prosemirror-suggestcat-plugin";
import styled from "@emotion/styled";
import {
  dispatchWithMeta,
  SlashMenuKey,
  SlashMenuPlugin,
  SlashMetaTypes,
} from "prosemirror-slash-menu";
import { usePopper } from "react-popper";
import {
  promptCommands,
  promptIcons,
  ProsemirrorSuggestcatPluginReact,
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

const AiTooltip = styled.div`
  display: flex;
  height: 36px;
  width: 60px;
  align-items: center;
  margin-left: 0.5rem;
  transition: 0.3s;
  font-weight: 600;
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
          text: "...my heart is like an open highway - like Frankie said, 'I did it my way'.",
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
  const [toolTipPopperElement, setToolTipPopperElement] =
    useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const state = EditorState.create({
      doc: schema.nodeFromJSON(initialDoc),
      plugins: [
        SlashMenuPlugin(promptCommands, undefined, undefined, true),
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

  const tooltipVirtualRef = useMemo(() => {
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
  }, [editorView?.state, window.scrollY]);

  const { styles, attributes } = usePopper(
    // @ts-ignore TODO
    tooltipVirtualRef,
    toolTipPopperElement,
    {
      placement: "left",
      modifiers: [
        { name: "flip", enabled: true },
        {
          name: "preventOverflow",
          options: {
            mainAxis: false,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 20],
          },
        },
      ],
    }
  );

  const suggestionState = useMemo(() => {
    if (!editorView?.state) return;
    return completePluginKey.getState(editorView?.state);
  }, [editorView?.state]);

  const shouldDisplay = useMemo(() => {
    if (!editorView?.state) return false;
    const slashMenuOpen = SlashMenuKey.getState(editorView?.state)?.open;

    return (
      editorView?.state?.selection.from !== editorView?.state?.selection.to &&
      !slashMenuOpen &&
      suggestionState?.status === Status.idle
    );
  }, [editorView?.state, suggestionState]);

  const handleTooltipClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!editorView) return;
      dispatchWithMeta(editorView, SlashMenuKey, {
        type: SlashMetaTypes.open,
      });
      return true;
    },
    [editorView]
  );

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
      {shouldDisplay && (
        <div
          id={"popper"}
          // @ts-ignore
          ref={setToolTipPopperElement}
          className={"ai-tooltip"}
          style={{
            ...styles.popper,
          }}
          {...attributes.popper}
          onClick={handleTooltipClick}
        >
          {promptIcons.StarIcon()}
          <AiTooltip>Ask AI</AiTooltip>
        </div>
      )}
    </Root>
  );
};
