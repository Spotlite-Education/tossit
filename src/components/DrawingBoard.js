import React, {useRef, useEffect, useState} from 'react';

//can pass variables in to change style, color, width, etc. (TODO)


const DrawingBoard = ({thickness, color, style, onSubmit}) => {

    //stores references
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        //doubled for more pixel dense screens
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d")
        context.scale(2,2)
        //default style, color, width
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5;

        //custom
        context.lineCap = style
        context.strokeStyle = color
        context.lineWidth = thickness;

        contextRef.current = context;
    }, [])

    const handleClick = () => {
        var image = new Image();
        image.src = canvas.toDataURL();
        onSubmit(image);        
    }

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX,offsetY)
        setIsDrawing(true);
    }

    const stopDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return
        }
        const {offsetX,offsetY} = nativeEvent
        contextRef.current.lineTo(offsetX,offsetY)
        contextRef.current.stroke()
    }

    return(
        <div>
            <button 
                onClick={() => {
                    handleClick();
                }
            }>
                Finish
            </button>
            <canvas
                onMouseDown = {startDrawing}
                onMouseUp = {stopDrawing}
                onMouseMove = {draw}
                ref = {canvasRef}
            />
        </div>
        
    );
}

export default DrawingBoard;