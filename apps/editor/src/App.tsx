import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-suggestcat-plugin/dist/styles/styles.css";
import "prosemirror-suggestcat-plugin-react/dist/styles/styles.css";

import { exampleSetup } from "prosemirror-example-setup";
import {
  completePlugin,
  completePluginKey,
  CompletePluginState,
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
  promptIcons,
  promptCommands,
  ProsemirrorSuggestcatPluginReact,
} from "prosemirror-suggestcat-plugin-react";

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
  ],
  type: "doc",
};

export const Editor: React.FunctionComponent = () => {
  const [editorView, setEditorView] = useState<EditorView>();
  const [editorState, setEditorState] = useState<EditorState>();
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
    return () => {
      view.destroy();
    };
  }, [editorRef]);

  const slashMenuPopperRef = useMemo(() => {
    if (!editorView || !editorState) return;
    return editorView.domAtPos(editorState.selection.to)?.node;
  }, [editorState]);

  const tooltipVirtualRef = useMemo(() => {
    if (!editorView || !editorState) return;
    return editorView.domAtPos(editorState.selection.to)?.node;
  }, [editorState?.selection, window.scrollY]);

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
    if (!editorState) return;
    const state = completePluginKey.getState(editorState);
    console.log({ state });
    return state;
  }, [editorState]);

  const shouldDisplay = useMemo(() => {
    if (!editorState) return false;
    const slashMenuOpen = SlashMenuKey.getState(editorState)?.open;

    return (
      editorState?.selection.from !== editorState?.selection.to &&
      !slashMenuOpen &&
      suggestionState?.status === Status.idle
    );
  }, [editorState, suggestionState]);

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
      {editorView && editorState && slashMenuPopperRef && (
        <ProsemirrorSuggestcatPluginReact
          editorView={editorView}
          editorState={editorState}
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
