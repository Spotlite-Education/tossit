import React from 'react';
import { Link } from 'react-router-dom';
import Corner from '../components/Corner';
import { generateCode } from '../util/random';
import '../styles/Create.scss';

const Create = () => {
    return (
        <main>
            <h1 id='title'>CREATE - IT</h1>
            <button
                className='big-button'
                onClick={() => {
                    console.log(generateCode(6));
                }}
            >
                Create Room
            </button>
            <Corner corner='tr' className='link-box'>
                <Link to='/' className='link-text'>Player Mode</Link>
            </Corner>
        </main>
    );
}

export default Create;
