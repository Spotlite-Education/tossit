import React, {useRef, useEffect, useState} from 'react';

const TextQuestion = () => {

    const [data,setData] = useState(null);
    const [print,setPrint] = useState(false);


    const getData = (event) => {
        setData(event.target.value)
    }

    return(
        <div>
            <h1 id = "title">Write your question below:</h1>
            <hr/>
            <input type = "text"
                placeholder = "Question Here..."
                onChange = {getData}
            />
            <button 
            onClick = {() => setPrint(true)}>
                Finish
            </button>
        </div>
    );
}

export default TextQuestion;