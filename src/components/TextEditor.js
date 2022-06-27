import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/Editor.scss';
import draftToHtml from 'draftjs-to-html';

const TextEditor = () => {
    const [state, setState] = React.useState(EditorState.createEmpty());
    const [value, setValue] = React.useState('');
    console.log(value);

    return (
        <div id='editor'>
            <Editor
                editorState={state}
                toolbarClassName='toolbarClassName'
                wrapperClassName='wrapperClassName'
                onEditorStateChange={newState => {setState(newState); setValue(draftToHtml(convertToRaw(state.getCurrentContent())))}}
                placeholder='Type your question here...'
            />
        </div>
    );
}

export default TextEditor;