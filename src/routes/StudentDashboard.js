import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/StudentDashboard.scss';
import Dropdown from '../components/Dropdown';
import FreeResponse from '../components/FreeResponse';
//import DrawingBoard from '../components/DrawingBoard';
//import TextQuestion from '../components/TextQuestion';

const questionTypeValues = ['frq', 'mcq']; // mcq includes t/f questions
const questionTypeNames = ['Free Response', 'Multiple Choice'];
// TODO extension: question type of matching and completion

const StudentDashboard = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();

    React.useEffect(() => {
        socket.emit('checkEnterStudentDashboard', params.roomCode);
        socket.on('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING STUDENT DASHBOARD: ' + message);
            return <Navigate to='/host/' />; // TODO: fix
        });
    }, []);

    const [questionData, setQuestionData] = React.useState({
        type: questionTypeValues[0],
        statement: null,
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });

    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string

    const handleUpdateQuestion = (key) => {
        return (newValue) => {
            let newQuestionData = { ...questionData };
            newQuestionData[key] = newValue;
            setQuestionData(newQuestionData);
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (event.keyCode === 13) return false; // prevent submission when pressing enter

        socket.emit('setToss', { question: questionData, answer: answerData, roomCode: params.roomCode } );
    };
    
    return(
        <>
            <main>
                <form onSubmit={handleSubmit}>
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
}

export default StudentDashboard;