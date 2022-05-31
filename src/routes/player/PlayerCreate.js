import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import Dropdown from '../../components/Dropdown';
import FreeResponse from '../../components/FreeResponse';
//import DrawingBoard from '../components/DrawingBoard';

const questionTypeValues = ['frq', 'mcq']; // mcq includes t/f questions
const questionTypeNames = ['Free Response', 'Multiple Choice'];
// TODO extension: question type of matching and completion

const PlayerCreate = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    
    const [questionData, setQuestionData] = React.useState({
        type: questionTypeValues[1],
        statement: null,
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });
    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string
    const [tossed, setTossed] = React.useState(false);

    const handleUpdateQuestion = (key) => {
        return (newValue) => {
            let newQuestionData = { ...questionData };
            newQuestionData[key] = newValue;
            setQuestionData(newQuestionData);
            setTossed(false);
        };
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (e.keyCode === 13) return false; // prevent submission when pressing enter TODO: fix

        setTossed(true);
        socket.emit('setToss', { question: questionData, answer: answerData, roomCode: params.roomCode } );
    };

    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>CREATE:</h1>
            </nav>
            <main>
                <form onSubmit={(e) => handleCreate(e)}>
                    <Dropdown
                        labelTextComponent={<p>Select Question Type:</p>}
                        valueOptions={questionTypeValues}
                        textOptions={questionTypeNames}
                        valueState={questionData.type}
                        onChange={handleUpdateQuestion('type')}
                    />
                    <FreeResponse
                        labelTextComponent={<p>Question:</p>}
                        onChange={handleUpdateQuestion('statement')}
                        placeholder='Type your question here...'
                    />
                    <FreeResponse
                        labelTextComponent={<p>Answer:</p>}
                        onChange={newAnswer => { setAnswerData(newAnswer); setTossed(false); }}
                        placeholder='Type the answer here...'
                    />
                    <br />
                    <input className='submit-button' style={{ width: '6rem', height: '3rem', fontSize: '1.25rem' }} type='submit' value='Toss It!' />
                    {tossed && <p>Tossed!</p>}
                </form>
                {/*
                <DrawingBoard
                    thickness={5} 
                    color = "black" 
                    style = "round" 
                    onSubmit={setPicture}
                /> */}
            </main>
        </>
    );
}

export default PlayerCreate;