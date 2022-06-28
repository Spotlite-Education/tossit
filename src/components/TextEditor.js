import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/Editor.scss';

const maxChars = 350;
const maxLines = 8;

const TextEditor = ({ state, setState }) => {

    const handleBeforeChange = (val) => {
        const text = state.getCurrentContent().getPlainText('');
        const lines = text.split('\n').length + val.split('\n').length;
        if (text.length + val.length > maxChars || lines >= maxLines) {
            return 'handled';
        }
    };

    return (
        <div id='editor'>
            <Editor
                editorState={state}
                wrapperStyle={{
                    overflow: 'unset',
                    height: '20rem'
                }}
                editorClassName = 'editorClass'
                handleBeforeInput={handleBeforeChange}
                handlePastedText={handleBeforeChange}
                onEditorStateChange={setState}
                placeholder='Type your question here...'
            />
        </div>
    );
}
TextEditor.propTypes = {
    state: PropTypes.any.isRequired,
    setState: PropTypes.func.isRequired,
}

/* setValue(draftToHtml(convertToRaw(state.getCurrentContent())))*/

export default TextEditor;