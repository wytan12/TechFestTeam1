import React, { useRef, useState } from 'react'
import "./TextGen.css"

const TextGen = () =>{

    const [messages,setMessages]= useState([]);
    const inputRef = useRef(null);

    const generator = async () =>{
        if(inputRef.current.value==""){
            return 0;
        }
        const response = await fetch(
            {
                method:"POST",

            }
        )
    }

    return (
        <div>
            <div className='header'> GSN -_-</div>
            <div className="search-box">
                <input type="text" ref={inputRef} className='search-input' placeholder='Message GSN ... '/>
                <div className="generate-btn" onClick={()=>{generator()}}>Generate</div>
            </div>
        </div>
    )
}

export default TextGen
