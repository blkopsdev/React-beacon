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
  editorState: any;
}

class RichTextEditor extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        stateFromHTML(this.props.initialContent)
      )
    };
    // this.onChange.bind(this);
    // this.handleKeyCommand.bind(this);
    // this.onBoldClick.bind(this);
  }
  onChange = (editorState: any) => {
    this.setState({ editorState });
    this.props.onChange(stateToHTML(editorState.getCurrentContent()));
  };
  // handleKeyCommand(command: any, editorState: any) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.onChange(newState);
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // }
  // onBoldClick() {
  //   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  // }
  // onULClick() {
  //   this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'UL'));
  // }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onChange}
        toolbar={{
          options: ['inline', 'list']
        }}
      />
    );
  }
}

export default RichTextEditor;
