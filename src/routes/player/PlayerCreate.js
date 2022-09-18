import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import { generateId } from '../../util/random';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Paper from '../../components/Paper';
import { EditorState, convertToRaw } from 'draft-js';
import TextEditor from '../../components/TextEditor';
import { TossPlanes } from '../../components/TossPlanes';
import ErrorDisplay from '../../components/ErrorDisplay';
import draftToHtml from 'draftjs-to-html';
import * as constants from '../../util/constants';
// import { IconContext } from "react-icons";

export const FRQ = 'frq';
export const MCQ = 'mcq'

const questionTypeValues = [FRQ, MCQ]; // mcq includes t/f questions
//const questionTypeNames = ['Free Response', 'Multiple Choice'];
// TODO extension: question type of matching and completion

const PlayerCreate = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [questionData, setQuestionData] = React.useState({
        type: questionTypeValues[1],
        statement: '',
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });
    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string
    const [flagged, setFlagged] = React.useState(false);
    const [tossed, setTossed] = React.useState(false);
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

    const checkEditorIsEmpty = (plainTextLength) => { return plainTextLength === 0; } // TODO: still a crude solution

    const handleSetFlagged = React.useCallback(newFlagged => {
        setFlagged(newFlagged);
        if (newFlagged)
        {
            setTossed(false);
        }
    }, []);

    const handleTossData = () => {
        const currentEditorContent = editorState.getCurrentContent();
        const plainTextLength = currentEditorContent.getPlainText('').length;
        if (checkEditorIsEmpty(plainTextLength) || answerData === '') { // TODO: make more robust with questionData.statement (e.g. with other question types like FRQ - make more org'ed and clear)
            return;
        }
        const editorContentHTML = draftToHtml(convertToRaw(currentEditorContent));
        socket.emit('setToss', { question: { ...questionData, editorContentHTML, plainTextLength }, answer: answerData, roomCode: params.roomCode });
        setTossed(true);
    };

    React.useEffect(() => {
        socket.on('setFlagged', handleSetFlagged);
        socket.on('forceSetToss', handleTossData);

        return () => {
            socket.off('setFlagged', handleSetFlagged);
            socket.off('forceSetToss', handleTossData);
        };
    }, [socket, questionData, answerData]);

    const handleCreate = (e) => {
        e.preventDefault();
        if (e.keyCode === 13) return false; // prevent submission when pressing enter TODO: fix

        handleTossData();
    };

    // const handleUpdateQuestion = (key, value) => {
    //     setQuestionData({ ...questionData, [key]: value });
    //     setTossed(false);
    // };

    const handleAddBlankMcqChoice = React.useCallback((e) => {
        e.preventDefault();
        const id = generateId();
        const index = questionData.answerChoices.length + 1;
        setQuestionData({ ...questionData, answerChoices: [...questionData.answerChoices, { id, statement: 'Answer #' + index, correct: false }] });
        if (questionData.answerChoices.length === 1 || questionData.answerChoices.length === 0) setAnswerData('0');
    }, [questionData]);

    const handleChangeMcqAnswer = React.useCallback((id) => {
        const indexOf = questionData.answerChoices.findIndex((choice) => choice.id === id);
        // this is temporary, will be replaced by a real solution later
        questionData.answerChoices.forEach(choice => {
            choice.correct = false;
        });
        questionData.answerChoices[indexOf].correct = true;
        handleUpdateMcqChoice(id, 'correct', !questionData.answerChoices[indexOf].correct);
        setAnswerData(indexOf.toString());
    }, [questionData]);

    const handleUpdateMcqChoice = React.useCallback((id, property, value) => {
        const indexOf = questionData.answerChoices.findIndex((choice) => choice.id === id);
        const clone = questionData.answerChoices.slice();
        clone[indexOf][property] = value;
        setQuestionData({ ...questionData, answerChoices: clone });
    }, [questionData]);

    const handleRemoveMcqChoice = React.useCallback((id) => {
        const indexOf = questionData.answerChoices.findIndex((choice) => choice.id === id);
        questionData.answerChoices.splice(indexOf, 1);
        setQuestionData({ ...questionData, answerChoices: questionData.answerChoices });

        const numberOfQuestionChoices = questionData.answerChoices.length;
        const answer = parseInt(answerData);
        if (numberOfQuestionChoices === 0 || answer < 0 || answer >= numberOfQuestionChoices) {
            setAnswerData('');
        }
    }, [questionData]);

    const paperFront = (
        <div style={{ marginBottom: 'auto', width: '100%', height: '100%' }}>
            <TextEditor state={editorState} setState={setEditorState} />
        </div>
    );

    const paperBack = (
        <>
            <div className='form-section'>
                {questionData.type === FRQ ? (
                        <label onChange={(e) => { e.preventDefault(); setAnswerData(e.target.value) }}>
                            <Answer
                                type={questionData.type}
                                questionData={questionData}
                                handleChangeAnswer={handleChangeMcqAnswer}
                                handleUpdateChoice={handleUpdateMcqChoice}
                                handleRemoveChoice={handleRemoveMcqChoice}
                            />
                        </label>                            
                    ) : (
                    <Answer
                        type={questionData.type}
                        questionData={questionData}
                        correctAnswer={parseInt(answerData)}
                        handleChangeAnswer={handleChangeMcqAnswer}
                        handleUpdateChoice={handleUpdateMcqChoice}
                        handleRemoveChoice={handleRemoveMcqChoice}
                    />
                )}
                <div id='mcq-bar' style={questionData.type !== MCQ ? { marginBottom: 0 } : {}}>
                    {questionData.type === MCQ && <button disabled={questionData.answerChoices.length >= constants.TOSS.CREATION.ANSWER.MAX_MCQ_CHOICES} style={{ 
                        pointerEvents: 'all',
                        fontSize: '2rem',
                        fontStyle: 'bold',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                        }} onClick={(e) => handleAddBlankMcqChoice(e)}>
                        +
                    </button>}
                </div>
            </div>
            <div className='form-section'>
                <input
                    disabled={questionData.answerChoices.length <= 0}
                    className='submit-button'
                    style={{ width: '6rem', height: '3rem', fontSize: '1.25rem',
                        marginTop: 'auto',
                        opacity: '100%',
                        color: 'rgba(76,88,117,255)',
                    }}
                    type='submit'
                    value='Toss It!' 
                />
            </div>
        </>
    );

    // FOR FRQ: 
    // const formTypeBoxes = React.useCallback(() => {
    //     return questionTypeNames.slice(1).map((name, index) => { // temporarily only allow mcq
    //         const selected = index === questionTypeValues.indexOf(questionData.type); 

    //         return (
    //             <button
    //                 key={name + index.toString()}
    //                 style={selected ? { borderColor: 'white' } : {}}
    //                 onClick={(e) => {
    //                     e.preventDefault();
    //                     handleUpdateQuestion('type', questionTypeValues[index + 1])
    //                 }}
    //             >
    //                 {name}
    //             </button>
    //         );
    //     });
    // }, [questionData]);

    // const typeBoxes = formTypeBoxes();

    return (           
        <main>
            {tossed ? 
                <>
                    <div id='loading'>
                        <TossPlanes />
                    </div>
                    <div className='loading-text' style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',   
                        transform: 'translate(-50%, 0%)',      
                        display: 'flex',
                        flexDirection: 'column',    
                        alignItems: 'center'       
                    }}>
                        Tossing...
                        <button
                            className='small-button'
                            style={{ margin: '1rem', fontSize: '1.5rem' }}
                            onClick={() => {
                                setTossed(false);
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </>
            :
                <form onSubmit={(e) => handleCreate(e)}>
                    {/* FOR FRQ OPTION
                        <div className='form-section'>
                        <h4>Type:</h4>
                        {typeBoxes}
                    </div> */}
                    <Paper frontComponent={paperFront} backComponent={paperBack} size={'70%'}></Paper>
                </form>
            }
                              
            {/*
            <DrawingBoard
                thickness={5} 
                color = "black" 
                style = "round" 
                onSubmit={setPicture}
            /> */}

            {flagged &&
                <ErrorDisplay
                    errorMessage='Your toss has been flagged. Please revise in order to submit.'
                />
            }
        </main>
    );
}

const Answer = ({ type, questionData, correctAnswer, handleChangeAnswer, handleUpdateChoice, handleRemoveChoice }) => {
    switch (type) {
        case FRQ:
            return <input type='text' placeholder='To avenge their family at KFC.' value={questionData.answer}/>
        case MCQ:
            return (
                <McqForm
                    correctAnswer={correctAnswer}
                    existingAnswers={questionData.answerChoices}
                    handleChangeAnswer={handleChangeAnswer}
                    handleUpdateChoice={handleUpdateChoice}
                    handleRemoveChoice={handleRemoveChoice}
                />
            );
        default:
            return <p>Answer</p>
    }
};

Answer.propTypes = {
    type: PropTypes.oneOf(questionTypeValues).isRequired,
    questionData: PropTypes.object.isRequired,
    correctAnswer: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChangeAnswer: PropTypes.func.isRequired,
    handleRemoveChoice: PropTypes.func.isRequired,
    handleUpdateChoice: PropTypes.func.isRequired,
};

const McqForm = ({ existingAnswers, correctAnswer, handleChangeAnswer, handleUpdateChoice, handleRemoveChoice }) => {
    const formChoiceBoxes = React.useCallback(() => {
        return existingAnswers.map((answer, index) => {
            return (
                <Choice
                    key={answer.id}
                    correct={index === correctAnswer}
                    id={answer.id}
                    statement={answer.statement}
                    handleChangeAnswer={handleChangeAnswer}
                    handleUpdateChoice={handleUpdateChoice}
                    handleRemoveChoice={handleRemoveChoice}
                />
            );
        });
    }, [existingAnswers, correctAnswer]);

    const choiceBoxes = formChoiceBoxes();
    
    return (
        <div>
            {choiceBoxes}
        </div>
    );
};

McqForm.propTypes = {
    existingAnswers: PropTypes.arrayOf(
        PropTypes.shape({
            statement: PropTypes.string.isRequired,
            correct: PropTypes.bool.isRequired,    
        }),
    ),
    correctAnswer: PropTypes.number.isRequired,
    handleChangeAnswer: PropTypes.func.isRequired,
    handleRemoveChoice: PropTypes.func.isRequired,
    handleUpdateChoice: PropTypes.func.isRequired,
};

const Choice = ({ correct, statement, id, handleChangeAnswer, handleUpdateChoice, handleRemoveChoice }) => {
    return (
        <div className='choice'
            style={{ borderColor: correct ? 'rgba(30, 200, 25, 1)' : undefined,
                backgroundColor: correct ? 'rgba(14, 166, 11, 0.5)' : undefined }}>
            <button
                className='circle-button-check'
                onClick={(e) => {
                    e.preventDefault();
                    handleChangeAnswer(id);
                }}
            >
                {correct && <AiOutlineCheck fill='rgb(150, 150, 150)' />}
            </button>
            <label>
                <input
                    type='text'
                    style={{ borderColor: statement.length <= 0 ? 'white' : undefined }}
                    onChange={(e) => {
                        e.preventDefault();
                        handleUpdateChoice(id, 'statement', e.target.value);
                    }}
                    value={statement}
                />
            </label>
            <button
                className='circle-button-delete'
                onClick={(e) => {
                    e.preventDefault();
                    handleRemoveChoice(id);
                }}
            >
                <AiOutlineClose />
            </button>
        </div>
    );
};

Choice.propTypes = {
    correct: PropTypes.bool.isRequired,
    statement: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    handleChangeAnswer: PropTypes.func.isRequired,
    handleRemoveChoice: PropTypes.func.isRequired,
    handleUpdateChoice: PropTypes.func.isRequired,
};

export default PlayerCreate;
