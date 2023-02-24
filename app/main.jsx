// this file is based on the example here https://www.telerik.com/kendo-react-ui/components/editor/images/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import content from './content';
import { Editor, EditorTools, ProseMirror } from '@progress/kendo-react-editor';
import { InsertImage } from './insertImageTool';
import { insertImagePlugin } from './insertImagePlugin';
import { insertImageFiles } from './utils';
const { Bold, Italic, Underline, Undo, Redo } = EditorTools;
// Styles definition modified from https://www.telerik.com/kendo-react-ui/components/editor/styling-content/
const styles = `
    img {
        max-width: 100%;
    }
`;
const App = () => {
  const onImageInsert = (args) => {
    const { files, view, event } = args;
    const nodeType = view.state.schema.nodes.image;
    const position =
      event.type === 'drop'
        ? view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })
        : null;
    insertImageFiles({
      view,
      files,
      nodeType,
      position,
    });
    return files.length > 0;
  };
  const onMount = (event) => {
    const state = event.viewProps.state;
    const plugins = [...state.plugins, insertImagePlugin(onImageInsert)];
    // Iframe insertion and style insertion copied from https://www.telerik.com/kendo-react-ui/components/editor/styling-content/
    const iframeDocument = event.dom.ownerDocument;
    const style = iframeDocument.createElement('style');
    style.appendChild(iframeDocument.createTextNode(styles));
    iframeDocument.head.appendChild(style);
    return new ProseMirror.EditorView(
      {
        mount: event.dom,
      },
      {
        ...event.viewProps,
        state: ProseMirror.EditorState.create({
          doc: state.doc,
          plugins,
        }),
      }
    );
  };
  return (
    <Editor
      tools={[[Bold, Italic, Underline], [Undo, Redo], [InsertImage]]}
      defaultContent={content}
      contentStyle={{
        height: 430,
      }}
      onMount={onMount}
    />
  );
};
ReactDOM.render(<App />, document.querySelector('my-app'));
