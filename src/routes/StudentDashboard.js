import React from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import '../styles/StudentDashboard.scss';
//import DrawingBoard from '../components/DrawingBoard';
import TextQuestion from '../components/TextQuestion';

const StudentDashboard = () => {
        
    //const [picture, setPicture] = React.useState(null);
    const [questionState, setQuestionState] = React.useState({
        Question: {
            //multiple choice choices
            mcq: {
                A: 'A',
                B: 'B',
                C: 'C',
                D: 'D',
            },
            //text question and picture
            saq: 'question',
            pic: 'default'
        },      
    });

    const [answerState, setAnswerState] = React.useState({
        Answer: {
            mcqAnswer: ''
            //Maybe add a picture for this part too
        }
    });

    //defines variables
    const choiceA = questionState.Question.mcq.A
    const choiceB = questionState.Question.mcq.B
    const choiceC = questionState.Question.mcq.C
    const choiceD = questionState.Question.mcq.D
    const saq = questionState.Question.saq
    const pic = questionState.Question.pic
    const mcqAnswer = answerState.Answer.mcqAnswer

    //changing the question:
    const createQuestion = ({allText, pictureUrl}) => {
        setQuestionState(prevQuestionState => {
            return {
                ...prevQuestionState,
                choiceA: allText[1],
                choiceB: allText[2],
                choiceC: allText[3],
                choiceD: allText[4],
                saq: allText[0],
                pic: pictureUrl
            }
        })
    }

    const createAnswer = (answer) => {
        setAnswerState(prevQuestionState => {
            return {
                mcqAnswer: answer
            }
        })
    }

    //socket stuff
    const socket = React.useContext(SocketContext);
    const params = useParams();

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
                </form>
                <TextQuestion
                    onSubmit = {handleQuestion}
                />
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