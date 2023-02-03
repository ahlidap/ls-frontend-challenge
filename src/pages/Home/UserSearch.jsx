import React from "react"
import "./usersearch.scss"

function UserSearch (props) {
    
    return(
        <div className="user-search-container">
            <div className="header-text">
                <h2 className="title">Search Github Users</h2>
                <div>
                    <p className="sub-title">You can use this application to search for users on Github.</p>
                    <p className="sub-title">Please type bellow the user you want to search.</p>
                    <p className="sub-title">You can then click on the results to retrieve more info about such users.</p>
                </div>
            </div>

            <div className="search">
                <input
                    className="search-input"
                    id="query"
                    name="query"
                    type="text"
                    placeholder="Search query"
                    value={props.message}
                    onChange={props.handleChange}
                    onKeyDown={props.handleKeyDown}
                />

                <button id="fetch-btn" className="btn1" onClick={props.doSearch}>Fetch</button>
            </div>
        </div>    
    );   
}


export default UserSearch;