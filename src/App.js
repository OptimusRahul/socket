import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { connect } from 'socket.io-client';
import { Conversations } from './conversations';
import { Messages } from './messages';

import './App.css';
import { useEffect, useState } from 'react';

const socket = connect('http://localhost:4000', {
  extraHeaders: {
    Authorization: "Bearer authorization_token_here"
  }
})

function App() {
  const [messages, setMessages] = useState({})
  const [typing, setTyping] = useState();
  const loggedInUser = window.localStorage.getItem('loggedIn');

  useEffect(() => {
    socket.on('message_response', data => {
      console.log('message-response : ', data)
        setMessages(prev => {
          const foundMsg = prev[data.to]?.find(msg => msg.id === data.id)
          if(foundMsg) {
            return prev;
          }
          return {
            ...prev,
            [loggedInUser]: [...(prev[loggedInUser] ?? []), data],
            [data.to]: [...(prev[data.to] ?? []), data]
          }
        })
    })

    socket.on('initiate_user_conversation_response', data => {
      console.log('data : ', data)
      // setConversation(prev => ([...prev, data]))
    })

    socket.on('update-unread-message-status-response', data => {
      setMessages(prev => {
        const allMessage = prev[data.to]?.map(msg => {
          const foundMsg = data.unreadMessages.find(unmsg => unmsg.id === msg.id);
          if(foundMsg) {
            return foundMsg
          }
          return msg;
        })

        return {
          ...prev,
          [loggedInUser]: allMessage,
          [data.to]: allMessage
        }
      })
    })

    socket.on('typing_response', data => {
      console.log('typing-response', data)
      setTyping(data)
    })

    socket.on('conversations', data => {
      console.log('data : ', data)
    })

    // return () => {
    //   socket.off('message-response')
    //   socket.off('typing-response')
    // }
  }, [])

  const message = messages[loggedInUser] ?? []

  console.log('message : ', message)

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/conversation'  element={<Conversations socket={socket} typing={typing} messages={message} />} />
          <Route path='/conversation/:id' element={<Messages socket={socket} messages={message} setMessages={setMessages} typing={typing} />} />
          <Route path='*' element={<Navigate to="/conversation" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
