import React from 'react';
import { useParams } from 'react-router-dom';
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
    const [questionData, setQuestionData] = React.useState({
        type: questionTypeValues[0],
        statement: null,
        pictureURL: null, // supplementary picture diagram for question statement
        answerChoices: [], // if type is 'frq', keep empty
    });

    const [answerData, setAnswerData] = React.useState(''); // mcq: index of correct answer choice, frq: exact correct answer string

    /*
    const setPicture = (url) => {
        setQuestionData(prevQuestionData => {
            return {
                ...prevQuestionData,
                pictureURL: url
            }
        })
    }
    */

    const socket = React.useContext(SocketContext);
    const params = useParams();

    const handleUpdateQuestion = (key) => {
        return (newValue) => {
            let newQuestionData = { ...questionData };
            newQuestionData[key] = newValue;
            setQuestionData(newQuestionData);
            alert('New question data: ' + newQuestionData);
        };
    };

    const handleSubmit = (event) => {
        alert(questionData);
        //socket.emit('setToss', { question: questionData, answer: answerData, roomCode: params.roomCode } );
        event.preventDefault();
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