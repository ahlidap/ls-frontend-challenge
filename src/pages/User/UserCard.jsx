import React from "react"
import "./usercard.scss"

function UserCard (props) {
    let avatar, name, username, repoNumber;
    if(props.userData) {
        avatar = props.userData.avatar_url;
        name = props.userData.name;
        username = props.userData.login;
        repoNumber = props.userData.public_repos
    }
    return(
        <div className="user-card" data-testid="user-card">
            <div 
                className="image-container"
                style={{
                    backgroundImage: `url(${avatar})`
                }}
            ></div>

            <div className="info-container">
                <ul>
                    <li><span className="data-title">Username:</span>{username}</li>
                    <li><span className="data-title">Name:</span>{name}</li>
                    <li><span className="data-title">Number of repos:</span>{repoNumber} Public Repos</li>
                </ul>
            </div>
        </div>
    );   
}


export default UserCard;