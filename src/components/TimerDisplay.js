import React from "react";
import PropTypes from 'prop-types';
import '../App.scss';

const TimerDisplay = ({ startTime, durationSeconds }) => {
    const [secondsRemaining, setSecondsRemaining] = React.useState(durationSeconds);

    React.useEffect(() => {
        var interval = setInterval(() => {
            const curTime = new Date();
            const secondsElapsed = (curTime - startTime) / 1000;
            setSecondsRemaining(Math.max(0, durationSeconds - secondsElapsed));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutesLeft = parseInt(secondsRemaining / 60);
    const secondsLeft = parseInt(secondsRemaining % 60);
    const secondsString = (secondsLeft < 10 ? '0' : '') + secondsLeft.toString();

    if (secondsRemaining === 0) return null;
    return (
        <p id='timer-text'>
            {minutesLeft}:{secondsString}
        </p>
    );
}
TimerDisplay.propTypes = {
    startTime: PropTypes.object.isRequired,
    durationSeconds: PropTypes.number.isRequired
};

export default TimerDisplay;