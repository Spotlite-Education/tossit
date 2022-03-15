import React from 'react';

const AnswerBoard = ({question, answerChoices, onSubmit}) => {
    
    const studentQuestion = question;
    const choices = answerChoices.slice();

    const [finalAnswer,setAnswer] = React.useState(null);
    const [sendable,setSendable] = React.useState(false);

    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);

    React.useEffect(() => {

        //default is 5 minutes
        const [time, setTime] = 300000;

        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1000);

            const m = Math.floor((time) / (1000 * 60));
            setMinutes(m);

            const s = Math.floor((time % (1000*60)) / (1000));
            setSeconds(s);

        }, 1000)

        return () => clearInterval(interval)
    }, []);

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
            <div className = "stylized-headers">
                <h1>Answer the tossed question!</h1>
            </div>

            {/* Timer */}
            <div className = "timer">
                <div className = "timer-segment">
                    <span className = "time">{minutes}</span>
                    <span className = "label">Minutes</span>
                </div>
                <div className = "timer-segment">
                    <span className = "time">{seconds}</span>
                    <span className = "label">Seconds</span>
                </div>
            </div>

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