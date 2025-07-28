import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import React, { useEffect, useState, useRef } from "react"

function App() {

  const [chatHistory, setChatHistory] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {

    //helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text, isError}])
    }
    //fortmat chat history  for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }))


    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!")

      //Clean and update chat history with bots response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()

      updateHistory(apiResponseText)
    } catch (error) {
      console.log(error.message, true)
    }
  }

  useEffect(() => {
    //Auto-scroll whenever chat updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"})
  }, [chatHistory])

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev) } id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">Close</span>
      </button>

      <div className="chatbot-popup">
        {/*Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Gasper</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev) } className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        {/*Chatbot body*/}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              How can I help you today?
            </p>
          </div>

          {/*Render the chat history */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/*Chatbot footer*/}
        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            chatHistory={chatHistory}
          />
        </div>
      </div>
    </div>
  )
}

export default App
