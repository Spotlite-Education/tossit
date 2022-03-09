import React from 'react';

const AnswerBoard = ({question, answerChoices, onSubmit}) => {
    
    const [finalAnswer,setAnswer] = React.useState(null);
    const [sendable,setSendable] = React.useState(false);

    const studentQuestion = question;
    const choices = answerChoices.slice();

    const saveAnswer = (answer) => {
        setAnswer(answer);
        alert('Answer has been saved!')
        setSendable(true);
    }

    const sendAnswer = () => {
        if(!sendable){
            alert('Answer not saved!')
            return;
        }
        onSubmit(finalAnswer);
    }

    return(
        <div className="Question">
            {/* Header */}

            {/* Timer */}

            {/* Question */}
            <div className = "stylized-answering">
                <h2>{studentQuestion}</h2>
                <ul>
                    <li>{choices[0]}</li>
                    <li>{choices[1]}</li>
                    <li>{choices[2]}</li>
                    <li>{choices[3]}</li>
                </ul>
            </div>

            {/* Save/Submit Answer Buttons */}

            <div className = "stylized-buttons">
                <button onClick={saveAnswer}>Save</button>
                <button onClick={sendAnswer}>Submit</button>
            </div>
        </div>
    );
}

export default AnswerBoard;