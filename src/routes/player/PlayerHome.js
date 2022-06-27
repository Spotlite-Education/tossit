import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import '../../styles/player/PlayerHome.scss';
import PlayerCreate from './PlayerCreate';
import PlayerRespond from './PlayerRespond';
import PlayerResult from './PlayerResult';
import PlayerReturn from './PlayerReturn';
import Leaderboard from '../Leaderboard';
import { FRQ } from './PlayerCreate';
import Corner from '../../components/Corner';
import TimerDisplay from '../../components/TimerDisplay';

const PlayerHome = () => {
    const socket = React.useContext(SocketContext);
    const params = useParams();
    const navigate = useNavigate();

    const { state } = useLocation();
    const username = state.username;
    const timerData = state.timerData;
    React.useEffect(() => {
        socket.emit('checkEnterPlayerHome', params.roomCode);
        socket.once('checkFail', ({ message }) => {
            console.log('ERROR ACCESSING PLAYER HOME: ' + message);
            navigate('/');
            return;
        });
    }, []);

    const [status, setStatus] = React.useState('create');
    const [score, setScore] = React.useState(0);
    const handleUpdateScore = React.useCallback(score => {
        setScore(score);
    });
    

    // respond
    const [receivedQuestion, setReceivedQuestion] = React.useState({});
    const [response, setResponse] = React.useState('');
    const [liked, setLiked] = React.useState(false);

    const handleTossQuestion = React.useCallback(questionObject => {
        setResponse('');
        setLiked(false);
        setReceivedQuestion(questionObject);
        setStatus('respond');
    });

    React.useEffect(() => {
        socket.on('tossQuestion', handleTossQuestion);
        socket.on('updateScore', handleUpdateScore);

        return () => {
            socket.off('tossQuestion', handleTossQuestion);
            socket.off('updateScore', handleUpdateScore);
        };
    }, [socket]);


    // result
    const [isCorrect, setIsCorrect] = React.useState(null);
    const [correctAnswer, setCorrectAnswer] = React.useState('');

    const handleRespond = (e) => {
        e.preventDefault();
        if (e.keyCode === 13) return false;

        socket.emit('respondToss', { response, liked, roomCode: params.roomCode } );
        socket.once('tossAnswer', ({ isCorrect, answer }) => {
            setIsCorrect(isCorrect);
            const answerAsInt = parseInt(answer);
            receivedQuestion.type === FRQ ? setCorrectAnswer(answer) : setCorrectAnswer({...receivedQuestion.answerChoices[answer], index: answerAsInt});
            setStatus('result');
        });
    }


    // return
    const [likes, setLikes] = React.useState(0);
    const [responses, setResponses] = React.useState([]);
    const [othersResponses, setOthersResponses] = React.useState([]);

    React.useEffect(() => {
        socket.once('returnToss', ({ likes, responses, othersResponses }) => {
            setLikes(likes);
            setResponses(responses);
            setOthersResponses(othersResponses);
            setStatus('return');
        });
    }, []);
    

    let PlayerPage = null;
    switch(status) {
        case 'create':
            PlayerPage = <PlayerCreate />;
            break;
        case 'respond':
            PlayerPage = <PlayerRespond
                questionData={receivedQuestion}
                response={response}
                setResponse={setResponse}
                liked={liked}
                setLiked={setLiked}
                handleRespond={handleRespond}
            />;
            break;
        case 'result':
            PlayerPage = <PlayerResult
                showCorrect={receivedQuestion.type !== 'frq'}
                questionData={receivedQuestion}
                response={response}
                isCorrect={isCorrect}
                correctAnswer={correctAnswer}
            />;
            break;
        case 'return':
            PlayerPage = <PlayerReturn
                likes={likes}
                responses={responses}
                othersResponses={othersResponses}
                handleOpenLeaderboard={() => setStatus('leaderboard')}
            />;
            break;
        case 'leaderboard':
            PlayerPage = <Leaderboard
                handleExit={() => setStatus('return')}
            />;
            break;
    }

    return (
        <>
            {PlayerPage}
            <Corner corner='tr' className='link-box'>
                <p>{username} | {score}</p>
            </Corner>
            {status === 'create' && <div style={{ position: 'absolute', top: '3rem', right: 0, padding: '1rem' }}> {/* TODO: timer not showing up (sometimes?) */}
                <TimerDisplay
                    startTime={timerData.start}
                    durationSeconds={timerData.durationSeconds}
                />
            </div>}
        </>
    );
}

export default PlayerHome;