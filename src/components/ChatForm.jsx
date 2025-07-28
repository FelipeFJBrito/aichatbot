import React, { useRef } from 'react'


function ChatForm({chatHistory,setChatHistory, generateBotResponse}) {
    const inputRef = useRef()
    {/*
        Unlike state variables managed by useState, 
        changes to a ref's value do not trigger a component re-render. 
        This makes useRef ideal for storing values that need to persist 
        between renders but don't directly affect the UI    
    */}

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const userMessage = inputRef.current.value.trim()
        {/*gets the current value inside the input*/}
        if(!userMessage) return
        inputRef.current.value = ""

        //update chat history with the user message
        setChatHistory((history) => [...history, {role: "user", text: userMessage}])

        //thinking placeholder for the bot
        setTimeout(() => {
            setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}]) 

            generateBotResponse([...chatHistory, {role: "user", text: userMessage}])

        }, 600)

    } 

    return (
        <form action='#' className="chat-form" onSubmit={handleFormSubmit}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Message..."
                className="message-input"
                required
            />
            <button className="material-symbols-rounded">
                arrow_upward
            </button>
        </form>
    )
}

export default ChatForm
