import React from 'react';

const DrawingBoard = ({thickness, color, style, onSubmit}) => {
    //stores references
    const canvasRef = React.useRef(null);
    const contextRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        //doubled for more pixel dense screens
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(2,2);
        //default style, color, width
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;

        //custom
        context.lineCap = style;
        context.strokeStyle = color;
        context.lineWidth = thickness;

        contextRef.current = context;
    }, [])

    const handleClick = () => {
        var image = new Image();
        //image.src is now the data url of the picture and can be used elsewhere
        image.src = canvasRef.current.toDataURL();
        onSubmit(image);        
    }

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX,offsetY);
        setIsDrawing(true);
    }

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return;
        }
        const {offsetX,offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX,offsetY);
        contextRef.current.stroke();
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