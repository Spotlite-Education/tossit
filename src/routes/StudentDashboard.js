import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/StudentDashboard.scss';
import Dropdown from '../components/Dropdown';
import FreeResponse from '../components/FreeResponse';
//import DrawingBoard from '../components/DrawingBoard';
//import TextQuestion from '../components/TextQuestion';

const questionTypeValues = ['frq', 'mcq']; // mcq includes t/f questions
const questionTypeNames = ['Free Response', 'Multiple Choice'];
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
        type: questionTypeValues[0],
        statement: null,
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });
    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string

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
        };
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (e.keyCode === 13) return false; // prevent submission when pressing enter TODO: fix

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
    
    switch(status) {
        case 'create':
            return(
                <>
                    <main>
                        <h1>Create Question:</h1>
                        <form onSubmit={(e) => handleCreate(e)}>
                            <Dropdown
                                labelTextComponent={<p>Select Question Type:</p>}
                                valueOptions={questionTypeValues}
                                textOptions={questionTypeNames}
                                valueState={questionData.type}
                                onChange={handleUpdateQuestion('type')}
                            />
                            <br />
                            <FreeResponse
                                labelTextComponent={<p>Question:</p>}
                                onChange={handleUpdateQuestion('statement')}
                            />
                            <br />
                            <br />
                            <FreeResponse
                                labelTextComponent={<p>Answer:</p>}
                                onChange={setAnswerData}
                            />
                            <br />
                            <br />
                            <br />
                            <input type='submit' value='Toss It!' />
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
                    <main>
                        <h1>Answer Question:</h1>
                        <br />
                        <h2>Question: {receivedQuestion.statement}</h2>
                        <form onSubmit={(e) => handleRespond(e)}>
                            <textarea
                                onChange={(e) => {setResponse(e.target.value)}}
                                value={response}
                                style={{ color: 'black' }}
                            />
                            <input type='submit' value='Submit Answer' />
                        </form>
                    </main>
                </>
            );
        case 'result':
            return (
                <>
                    <main>
                        <h1>Results:</h1>
                        <br />
                        <h2>Your Answer:</h2>
                        <p>{response}</p>

                        <h2>Correct Answer:</h2>
                        <p>{correctAnswer}</p>

                        { receivedQuestion.type !== 'frq' && 
                            <h2>Result: {isCorrect ? 'Correct!' : 'Incorrect :('}</h2>
                        }
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