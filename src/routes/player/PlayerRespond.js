import React from 'react';
import PropTypes from 'prop-types';
import { FRQ, MCQ } from './PlayerCreate';
import { generateId } from '../../util/random';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const PlayerRespond = ({ questionData, response, setResponse, liked, setLiked, handleRespond }) => {
    const handleSelectChoice = (index) => {
        setResponse(index.toString());
    };

    return (
        <>
            <nav id='nav-bar' style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                textAlign: 'center',
            }}>
                <h1 style={{ position: 'absolute', left: '1.5rem' }}>Question:</h1>
                <h1 style={{ fontSize: '2rem' }}>{questionData.statement}</h1>
            </nav>
            <main>
                <form
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
                    onSubmit={(e) => handleRespond(e)}
                >
                    <Answer selectedIndex={parseInt(response)} questionData={questionData} handleClick={handleSelectChoice} />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem' }}>
                        <button type='button' id='like-button' onClick={() => setLiked(!liked)}>
                            {liked ? <AiFillHeart fill='#ff3d51' size={30} /> : <AiOutlineHeart color='#dcdcdc' size={30} />}
                        </button>
                        <input disabled={!response} className='submit-button' style={{ margin: 0 }} type='submit' value='Submit Answer' />
                    </div>
                </form>
            </main>
        </>
    );
}

PlayerRespond.propTypes = {
    questionData: PropTypes.object.isRequired,
    response: PropTypes.string.isRequired,
    setResponse: PropTypes.func.isRequired,
    liked: PropTypes.bool.isRequired,
    setLiked: PropTypes.func.isRequired,
    handleRespond: PropTypes.func.isRequired,
};

const Answer = ({ selectedIndex, questionData, handleClick }) => {

    const answerChoices = questionData.answerChoices.map((choice, index) => {
        const id = generateId();
        const selected = index === selectedIndex;

        return (
            <button
                key={id}
                index={index}
                className='respond-choice'
                style={{ backgroundColor: selected ? 'lightslategray' : undefined, color: selected ? 'white' : undefined }}
                onClick={(e) => { e.preventDefault(); handleClick(index); }}
            >
                {choice.statement}
            </button>
        );
    });
    switch (questionData.type) {
        case FRQ:
            return (
                <textarea>

                </textarea>
            );
        case MCQ:
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '35rem',
                    height: 'fit-content',
                    boxSizing: 'border-box',
                    padding: '1.5rem',
                    margin: '1.5rem',
                    marginBottom: '0.5rem',
                    paddingBottom: '0.5rem',
                    backgroundColor: 'white'
                }}>
                    {answerChoices}
                </div>
            );
    }
};

Answer.propTypes = {
    selectedIndex: PropTypes.number,
    questionData: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
};

export default PlayerRespond;