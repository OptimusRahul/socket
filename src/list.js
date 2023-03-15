export const USERS = [
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

export const List = () => {
    return (
        <>
            {USERS.map(user => {
                return (
                    <div>{user.username}</div>
                )
            })}
        </>
    )
}