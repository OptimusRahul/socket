import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

const LoggedIN = {
    id: 'test',
    username: 'test',
}

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

export const Conversations = ({ socket, typing, messages }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const loggedInUser = useMemo(() => location.search.split('=')[1], [location.search])

    useEffect(() => {
        window.localStorage.setItem('loggedIn', loggedInUser)
    }, [loggedInUser])

    const currentLoggedIndex = USER_CONVOS.findIndex(convo => convo.username?.toLowerCase() === loggedInUser?.toLowerCase());

    if(currentLoggedIndex !== -1) {
        USER_CONVOS.splice(currentLoggedIndex, 1)
    }

    const handleConvoClick = (convo) => () => {
        socket.emit('join', { roomname: 'tomjerry' })
        socket.emit('user-convo', convo)
        navigate(`/conversation/${convo.id}`)
    }

    return (
        <>
            <div>Conversations</div>
            <div>Current user : {loggedInUser}</div>
            {USER_CONVOS.map(convo => {
                console.log('messages : ', messages)
                const userUnreadMessages = messages.filter(msg => {
                    if(msg.name?.toLowerCase() === convo.username?.toLowerCase() && msg.status !== 'read') {
                        return true;
                    }
                    return false;
                })

                console.log('userUnreadMessages : ', userUnreadMessages)

                // console.log(convo.username, typing?.userId)
                return (
                    <div onClick={handleConvoClick(convo)}>
                        {convo.username} {typing?.to === loggedInUser && convo.username.toLowerCase() === typing?.userId?.toLowerCase() ? typing?.msg : ''} {userUnreadMessages.length > 0 ? userUnreadMessages.length : ''}
                    </div>
                )
            })}
        </>
    )
}