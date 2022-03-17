import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/StudentDashboard.scss';
//import Dropdown from '../components/Dropdown';
import FreeResponse from '../components/FreeResponse';
//import DrawingBoard from '../components/DrawingBoard';

const questionTypeValues = ['frq', 'mcq']; // mcq includes t/f questions
//const questionTypeNames = ['Free Response', 'Multiple Choice'];
// TODO extension: question type of matching and completion

const ReturnedResponse = ({ username, isCorrect }) => {
    return (
        <div style={{ width: 200, height: 50, flexDirection: 'row' }}>
            <h3 style={{ marginRight: 20 }}>{username}:</h3>
            <h4>{isCorrect ? 'Correct' : 'Incorrect'}</h4>
        </div>
    );
}
ReturnedResponse.propTypes = {
    username: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool.isRequired,
};

const StudentDashboard = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        socket.emit('checkEnterStudentDashboard', params.roomCode);
        socket.on('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING STUDENT DASHBOARD: ' + message);
            navigate('/');
            return;
        });
        setLoading(false);
    }, []);


    const [status, setStatus] = React.useState('create');

    // creation
    const [questionData, setQuestionData] = React.useState({
        type: questionTypeValues[1],
        statement: null,
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });
    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string
    const [tossed, setTossed] = React.useState(false);

    // respond
    const [receivedQuestion, setReceivedQuestion] = React.useState({});
    const [response, setResponse] = React.useState('');

    // results
    const [isCorrect, setIsCorrect] = React.useState(null);
    const [correctAnswer, setCorrectAnswer] = React.useState('');

    // return
    const [returnedResponses, setReturnedResponses] = React.useState([]);

    React.useEffect(() => {
        socket.on('tossQuestion', questionObject => {
            setStatus('respond');
            setReceivedQuestion(questionObject);
        });

        socket.on('returnToss', responses => {
            setStatus('return');
            setReturnedResponses(responses);
        });

        // todo: unmount, add socket to below []
    }, []);

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

    const handleRespond = (e) => {
        e.preventDefault();
        if (e.keyCode === 13) return false;

        socket.emit('respondToss', { response, roomCode: params.roomCode } );
        socket.on('tossAnswer', ({ isCorrect, answer }) => { // memory leak TODO
            setIsCorrect(isCorrect);
            setCorrectAnswer(answer);
            setStatus('result');
        });
    }

    if (loading) return null;

    let correctPlayers = 0;
    for (let returnedResponse in returnedResponses) {
        if (returnedResponse.isCorrect) correctPlayers++;
    }
    const correctRate = correctPlayers / returnedResponses.length; // TODO

    let resultText = '';
    if (receivedQuestion.type !== 'frq') {
        resultText = isCorrect ? 'Correct!' : 'Incorrect...';
    }
    
    switch(status) {
        case 'create':
            return(
                <>
                    <nav id='nav-bar' style= {{
                        height: 100,
                        textAlign: 'center',
                    }}>
                        <h1>Create: {receivedQuestion.statement}</h1>
                    </nav>
                    <main>
                        <form onSubmit={(e) => handleCreate(e)}>
                            {/* <Dropdown
                                labelTextComponent={<p>Select Question Type:</p>}
                                valueOptions={questionTypeValues}
                                textOptions={questionTypeNames}
                                valueState={questionData.type}
                                onChange={handleUpdateQuestion('type')}
                            /> */}
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
        case 'respond':
            return (
                <>
                    <nav id='nav-bar' style= {{
                        height: 100,
                        textAlign: 'center',
                    }}>
                        <h1>Question: {receivedQuestion.statement}</h1>
                    </nav>
                    <main>
                        <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} onSubmit={(e) => handleRespond(e)}>
                            <textarea
                                onChange={(e) => {setResponse(e.target.value)}}
                                value={response}
                                style={{
                                    width: '75%',
                                    minHeight: 400,
                                    color: 'black',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    padding: '1rem',
                                    fontSize: '1.5rem',
                                    fontFamily: 'Jost-Book',
                                }}
                            />
                            <input className='submit-button' type='submit' value='Submit Answer' />
                        </form>
                    </main>
                </>
            );
        case 'result':
            return (
                <>
                    <nav id='nav-bar' style= {{
                        height: 100,
                        textAlign: 'center',
                    }}>
                        <h1>Result: {resultText}</h1>
                    </nav>
                    <main>
                        <h4>Your Answer:</h4>
                        <p>{response}</p> {/* TODO: make a margin component */}
                        
                        <br />

                        <h4>Correct Answer:</h4>
                        <p>{correctAnswer}</p>

                        <br />
                    </main>
                </>
            );
        case 'return':
            return (
                <>
                    <main>
                        <h1>Toss Returned:</h1>
                        <br /> {/* TODO: make sure this works */}
                        <h2>In total, {correctPlayers} players answered correctly out of {returnedResponses.length} total questions. The correct answer rate is {correctRate}.</h2>
                        <br />
                        <h3>Student Responses:</h3>
                        {returnedResponses.map((returnedResponse, index) => {
                            return <ReturnedResponse
                                key={index}
                                username={returnedResponse.username}
                                isCorrect={returnedResponse.isCorrect}
                            />;
                        })}
                    </main>
                </>
            );
        default: return null;
    }
}

export default StudentDashboard;