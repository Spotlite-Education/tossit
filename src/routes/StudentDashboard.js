import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/StudentDashboard.scss';
import DrawingBoard from '../components/DrawingBoard';
import TextQuestion from '../components/TextQuestion';

const StudentDashboard = () => {
    const [picture, setPicture] = React.useState(null);
    const [question, setQuestion] = React.useState("");
    const [answerChoices, setAnswerChoices] = React.useState(new Array(4).fill(""));
    const [answer, setAnswer] = React.useState("");

    const socket = React.useContext(SocketContext);
    const params = useParams();

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
        <>
            <main>
                {/*
                Possible further extension: multiple answer choices that are right
                
                <form onSubmit={this.handleSubmit}>
                    <label>
                    Pick the number of correct answer choices (default is 1):
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="one">1</option>
                            <option value="two">2</option>
                            <option value="three">3</option>
                            <option value="four">4</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>*/}
                <TextQuestion
                    onSubmit = {handleQuestion}
                />
                <DrawingBoard 
                    thickness={5} 
                    color = "black" 
                    style = "round" 
                    onSubmit={handlePicture}
                />
                <button onClick={() => console.log("send data to teacher")}>
                    TOSS IT!
                </button>
                
            </main>
        </>
    );
}

export default StudentDashboard;