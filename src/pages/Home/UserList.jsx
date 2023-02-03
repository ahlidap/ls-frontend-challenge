import React from "react"
import "./userlist.scss"

function UserSearch (props) {


    const getUsers = () => {
        let users = props.users;
        if(users && users.items && users.items.length) {
            return  users.items.map((user, idx) => {
                return <div
                    key={idx} 
                    className="user" 
                    >
                        <img className="avatar" src={user.avatar_url}></img>
                        
                        <div className="user-login">{user.login}</div>
                        <button className="btn1 view-user-btn" onClick={() => props.userClickAction(user.login, user.avatar_url)}>view user info</button>
                </div>
            });
        }
        return <p>No results yet.. Try to search something</p>
        
    }
    
    return(
        <div id="result-container" className="user-list-container">
            {getUsers()}
        </div>    
    );   
}


export default UserSearch;