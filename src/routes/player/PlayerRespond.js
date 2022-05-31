import React from 'react';
import PropTypes from 'prop-types';

const PlayerRespond = ({ receivedQuestion, response, setResponse, handleRespond }) => {
    return (
        <>
            <nav id='nav-bar' style= {{
                height: 100,
                textAlign: 'center',
            }}>
                <h1>QUESTION: {receivedQuestion}</h1>
            </nav>
            <main>
                <form
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
                    onSubmit={(e) => handleRespond(e)}
                >
                    <textarea
                        onChange={(e) => {setResponse(e.target.value)}}
                        value={response}
                        style={{
                            width: '75%',
                            minHeight: 400,
                            color: 'black',
                            outline: 'none',
                            boxSizing: 'border-box',
                            padding: '1rem',
                            fontSize: '1.5rem',
                            fontFamily: 'Jost-Book',
                        }}
                    />
                    <input className='submit-button' type='submit' value='Submit Answer' />
                </form>
            </main>
        </>
    );
}
PlayerRespond.propTypes = {
    receivedQuestion: PropTypes.string.isRequired,
    response: PropTypes.string.isRequired,
    setResponse: PropTypes.func.isRequired,
    handleRespond: PropTypes.func.isRequired,
};

export default PlayerRespond;