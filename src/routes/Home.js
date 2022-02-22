import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Corner from '../components/Corner';
import '../styles/Home.scss';

const Home = (/*{ socket }*/) => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    // const [username, setUsername] = useState("amogus"); // TMP

    const handleJoin = () => {
        console.log("Attempting to join with code " + code);
        setLoading(true);

        // TODO change query - follow this format: toss.it/?code=${code}
        // socket.emit('joinRoom', {
        //     code,
        //     username,
        // });

        setLoading(false);
    }

    return (
      <>
        <main>
            <h1 id='title'>TOSS - IT</h1>
            <Input width='22.5%' height='3.5rem' numInputs={6} outlineStyle='underscore' onSubmit={(newCode) => setCode(newCode)} />

            {/* TODO: either add a second input here for username, or link/route to another webpage to input name. When both
            code and username states are set, then call handleJoin(). */}
            <button onClick={handleJoin}>Enter</button> {/* TMP */}
            <Corner corner='tr' className='link-box'>
                <Link className='link-text' to='/create'>Teacher Mode</Link>
            </Corner>
        </main>
        {loading &&
            <div id='loading'>
                <p id='loading-text'>Validating Code...</p>
            </div>
        }
      </>
    );
}

export default Home;