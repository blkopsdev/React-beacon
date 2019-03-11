import * as React from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

interface Iprops {
  initialContent: any;
  onChange: any;
  readOnly: boolean;
}

interface Istate {
  editorState: EditorState;
}

class RichTextEditor extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);
    const editorState =
      typeof this.props.initialContent !== 'undefined'
        ? EditorState.createWithContent(
            stateFromHTML(this.props.initialContent)
          )
        : EditorState.createEmpty();
    this.state = { editorState };
  }
  onChange = (editorState: any) => {
    this.setState({ editorState });
    this.props.onChange(stateToHTML(editorState.getCurrentContent()));
  };
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onChange}
        toolbar={{
          options: ['inline', 'list']
        }}
        readOnly={this.props.readOnly}
      />
    );
  }
}

export default RichTextEditor;
