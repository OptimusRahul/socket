import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const USER_CONVOS = [
    {
        id: 'bob', 
        username: 'bob'
    },
    {
        id: 'tom',
        username: 'tom'
    },
    {
        id: 'jerry',
        username: 'jerry'
    }
]

export const Messages = ({ socket, messages, setMessages, typing, conversation}) => {
    const [text, setText] = useState('');
    const loggedInUser = window.localStorage.getItem('loggedIn');
    const location = useLocation();
    const currentUser = location.pathname.split('/').reverse()[0];

    const handleTyping = () => socket.emit('typing', {userId: loggedInUser, to: currentUser, roomname: 'tomjerry', msg: `${loggedInUser} is typing`})
    const handleStopTyping = () => {
        socket.emit('typing', {userId: loggedInUser,to: currentUser, roomname: 'tomjerry', msg: ''})
    }

    useEffect(() => {
        const unreadMessages = messages.filter(message => message.status !== 'read');
        const msg = {
            name: loggedInUser,
            to: currentUser,
            id: `${socket.id}${Math.random()}`, // replace with message id
            socketId: socket.id,
            roomname: 'tomjerry', // replace it with conversation id
            unreadMessages
        }

        console.log('unreadMessages : ', unreadMessages)
        if(unreadMessages.length > 0 && unreadMessages[0].to === loggedInUser) {
            setMessages(prev => {
                const allMessage = prev[loggedInUser]?.map(msg => {
                const foundMsg = unreadMessages.find(unmsg => unmsg.id === msg.id);
                if(foundMsg) {
                    return {
                        ...msg,
                        status: 'read',
                    }
                }
                return msg;
                })
        
                return {
                    ...prev,
                    [loggedInUser]: allMessage,
                }
            })
            
            socket.emit('update-unread-message-status', msg)
        }
    }, [messages])

    // console.log(location)

    useEffect(() => {
        const roomname = currentUser + loggedInUser;

        socket.emit('joined-user', { roomname: 'tomjerry' })

        // return () => {
        //     socket.off('joined-user')
        // }
    }, [])

    // console.log('messages : ', messages);


    const handleText = (e) => {
        const text = e.target.value;
        setText(text);
    }

    const sendMessage = (e) => {
        // emit socket event to send message
        e.preventDefault();
        const msg = {
            text,
            name: loggedInUser,
            to: currentUser,
            id: `${socket.id}${Math.random()}`,
            socketId: socket.id,
            roomname: 'tomjerry',
            status: 'delivered'

        }

        socket.emit("message", msg)

        // setMessages(prev => ({
        //     ...prev[loggedInUser],
        //     [loggedInUser]: [...(prev[loggedInUser] ?? []), msg]
        // }))

        setText("")
    }

    return (
        <>
            <div style={{ textAlign: 'center' }}>Messages : {loggedInUser}</div>
            <div>
                {messages.map(msg => {
                    return (
                        <div key={msg.id} style={{ textAlign: msg.to !== loggedInUser ? 'right' : 'left', padding: "0 10px" }}>
                            <span>{msg.name}</span> :  <span>{msg.text}</span> : <span>{msg.status}</span> 
                        </div>
                    )
                })}
                
                {/* <div style={{ display: 'flex', marginBottom: "100px" }}> */}
                {/* </div> */}
                <div style={{ float: 'right', marginTop: '100px' }}>
                    {typing?.userId !== loggedInUser ? <span>{typing?.msg}</span> : <span style={{ visibility: 'none' }}>hello</span>}
                    <input 
                        value={text} 
                        type="text" 
                        onChange={handleText} 
                        onKeyDown={handleTyping} 
                        onKeyUp={handleStopTyping}
                    />
                    <button onClick={sendMessage}>send</button>
                </div>
            </div>
        </>
    )
}