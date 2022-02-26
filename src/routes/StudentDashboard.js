import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/Dashboard.scss';
import DrawingBoard from '../components/DrawingBoard';
import TextQuestion from '../components/TextQuestion';

const StudentDashboard = () => {
    
    const [picture, setPicture] = React.useState(null);
    const [question, setQuestion] = React.useState("");
    const [answerChoices, setAnswerChoices] = React.useState(new Array(4).fill(""));
    const [answer, setAnswer] = React.useState("");

    const handlePicture = (image) => {
        setPicture(image);
    }

    const handleQuestion = (allText) => {
        //first item in this array is the question
        setQuestion(allText[0]);
        //answer choices
        setAnswerChoices(allText.slice(1,5));
        //correct answer
        setAnswer(allText[5]);
    }

    return(
        <div>
            <TextQuestion
                onSubmit = {handleQuestion}
            />
            <DrawingBoard 
                thickness={5} 
                color = "black" 
                style = "round" 
                onSubmit={handlePicture}
            />
            <button onClick={send /*TODO send the data/scramble the recipient*/}>
                TOSS IT!
            </button>
        </div>
    );
}

export default StudentDashboard;