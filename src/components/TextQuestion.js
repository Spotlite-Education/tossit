import React, {useRef, useEffect, useState} from 'react';

const TextQuestion = (onSubmit) => {

    const [data, setData] = React.useState(new Array(6).fill(""));
    const [finalData, setFinalData] = React.useState(new Array(6).fill(""));
    const [print,setSend] = useState(false);


    const getData = (event,index) => {
        const currentData = event.target.value
        const newData = data.slice();
        newData[index] = currentData;
        setData(newData);
        setSend(false);
    }

    const saveData = () => {
        setFinalData(data)
        alert('Work Saved!')
        setSend(true);
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
                required = {true}
                onChange = {getData(0)}
            />
            <input type = "text"
                placeholder = "Answer Choice A Here..."
                required = {true}
                onChange = {getData(1)}
            />
            <input type = "text"
                placeholder = "Answer Choice B Here..."
                required = {true}
                onChange = {getData(2)}
            />
            <input type = "text"
                placeholder = "Answer Choice C Here..."
                required = {true}
                onChange = {getData(3)}
            />
            <input type = "text"
                placeholder = "Answer Choice D Here..."
                required = {true}
                onChange = {getData(4)}
            />
            <input type = "text"
                placeholder = "Answer Choice D Here..."
                required = {true}
                onChange = {getData(5)}
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