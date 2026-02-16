import styled from "@emotion/styled";

export const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 8px;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: white;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

export const Button = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${(props) => (props.active ? "#e3f2fd" : "white")};
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #e0e0e0;
  }

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

export const StyledEditor = styled.div`
    width: 80%;
    height: 80vh;
    margin-bottom: 0.625rem;

    .ProseMirror-menubar-wrapper {
        height: 100%;
    }

    .ProseMirror {
        height: 100%;
        overflow: visible;
        margin-left: 2rem;
        margin-right: 2rem;
    }

    .ProseMirror p {
        position: relative;
    }

    /* Link detector styles */

    .link-detected {
        color: #0066cc;
        text-decoration: underline;
        cursor: pointer;
    }

    /* Word complexity styles */

    .word-complexity-moderate {
        background-color: rgba(255, 193, 7, 0.3);
        border-radius: 2px;
    }

    .word-complexity-high {
        background-color: rgba(244, 67, 54, 0.3);
        border-radius: 2px;
    }

    /* Sentence length styles */

    .sentence-too-long-warning {
        background-color: rgba(255, 152, 0, 0.2);
        border-radius: 2px;
    }

    .sentence-too-long-error {
        background-color: rgba(244, 67, 54, 0.2);
        border-radius: 2px;
    }

    /* Random processor styles */

    .random-processor-success {
        background-color: rgba(76, 175, 80, 0.2);
        border-radius: 2px;
    }

    .random-processor-widget {
        display: inline-block;
        padding: 2px 8px;
        margin-right: 8px;
        font-size: 12px;
        border-radius: 4px;
    }

    .random-processor-widget.queued,
    .random-processor-widget.processing {
        background: #e3f2fd;
        color: #1565c0;
    }

    .random-processor-widget.backoff {
        background: #fff3e0;
        color: #e65100;
    }

    .random-processor-widget.error {
        background: #ffebee;
        color: #c62828;
    }

    .random-processor-widget.dirty {
        background: #fff9c4;
        color: #f57f17;
    }

    .random-processor-widget.waiting {
        background: #e0e0e0;
        color: #616161;
    }

`;
