import React from 'react';
import Input from '../components/input';
import '../styles/Home.scss';

function Home() {
    const [loading, setLoading] = React.useState(false);
    const handleSubmit = (code) => {
        console.log(code);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }
    return (
      <>
        <main>
            <h1 id='title'>TOSS - IT</h1>
            <Input width='22.5%' height='3.5rem' numInputs={6} outlineStyle='underscore' onSubmit={(code) => handleSubmit(code)} />
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