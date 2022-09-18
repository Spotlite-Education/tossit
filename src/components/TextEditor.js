import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as constants from '../util/constants';
import '../styles/Editor.scss';

const calcOccurences = (string, subString, allowOverlapping) => { // https://stackoverflow.com/a/7924240
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    for (;;) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

const TextEditor = ({ state, setState }) => {
    const handleBeforeChange = (val) => {
        const text = state.getCurrentContent().getPlainText('');
        const curChars = text.length + val.length;
        const curLines = (calcOccurences(text.toString(), '\n') + 1) + calcOccurences(val.toString(), '\n');
        if (curChars > constants.TOSS.CREATION.QUESTION.MAX_CHARS || curLines > constants.TOSS.CREATION.QUESTION.MAX_LINES) {
            return 'handled';
        }
    };

    return (
        <div id='editor'>
            <Editor
                editorState={state}
                wrapperStyle={{
                    overflow: 'unset',
                    height: '25rem',
                }}
                editorClassName='editorClass'
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

export default TextEditor;