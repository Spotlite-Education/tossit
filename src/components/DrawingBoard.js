import React, {useRef, useEffect, useState} from 'react';

//can pass variables in to change style, color, width, etc. (TODO)
const DrawingBoard = () => {

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
        //default style
        context.lineCap = "round"
        //default color
        context.strokeStyle = "black"
        //default width
        context.lineWidth = 5;
        contextRef.current = context;
    }, [])

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
        <canvas
            onMouseDown = {startDrawing}
            onMouseUp = {stopDrawing}
            onMouseMove = {draw}
            ref = {canvasRef}
        />
    );
}

export default DrawingBoard;