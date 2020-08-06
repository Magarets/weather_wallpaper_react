import React,{useState} from 'react'


function Clock() {
    const [time,setTime]=useState(new Date());
    React.useEffect(()=>{
        var timer =setInterval(()=>tick(),1000);
        return function cleanup(){
            clearInterval(timer);
        };
    });
    function tick(){
        setTime(new Date());
    }
    return (
    <h1>{time.toLocaleTimeString()}</h1>
    );
}

export default Clock

