import React, {useRef, useEffect, useState} from 'react';

const TextQuestion = (onSubmit) => {

    const [data,setData] = useState(null);
    const [finalData, setFinalData] = useState (null);
    const [print,setSend] = useState(false);


    const getData = (event) => {
        setData(event.target.value)
        setSend(false)
    }

    const saveData = (event) => {
        setFinalData(data)
        setSend(true)
    }

    const handleFinish = () => {
        if(!print){
            alert('You have not saved your work!');
            return;
        }
        onSubmit(finalData);
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
            onClick = {saveData}>
                Save
            </button>

            <button 
            onClick = {handleFinish}>
                Finish
            </button>
        </div>
    );
}

export default TextQuestion;