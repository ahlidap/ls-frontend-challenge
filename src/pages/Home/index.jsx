import React from "react"
import { Fragment, useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api"
import Swal from 'sweetalert2'
import './index.scss'

function Home(props) {
    // Check if are coming back from user (ie. location.state exists)
    const location = useLocation();
    let receivedPage, receivedQuery;
    if (location && location.state) {
        receivedPage = location.state.pageNumber;
        receivedQuery = location.state.query;
    }

    const [page, setPagination] = useState(receivedPage ? receivedPage : 1)
    const [hasNext, setHasNext] = useState(false);
    const [message, setMessage] = useState(receivedQuery ? receivedQuery : "");
    const [users, setUsers] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const  navigate = useNavigate();

    /**
     * Hook to fetch data using GitHub REST API
     * Listens to changes on 'page'
     */
    useEffect(() => {
        if(message.length) {
            api.get("search/users", {
                params: {
                    q: message,
                    per_page: process.env.REACT_APP_ITEMS_PER_PAGE,
                    page: page,
                    sort: "joined",
                    order: "desc"
                }
            }).then((response) => {
                let data = response.data;
                setHasNext( page < data.total_count / process.env.REACT_APP_ITEMS_PER_PAGE);
                setUsers(data);
            }).catch((error) => {
                
                // TODO : Handle page count on error, should revert to previous stage

                let errorMessage = "Oops. Something went wrong!"
                if(error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK, I\'ll wait!'
                  });
            })
        }
     }, [requestCount]);


    /**
     * Handle evens on the input
     */

    const handleChange = (event) => {
        // Filter all special characters as safety measure
        //const result = event.target.value.replace(/[^a-z0-9]/gi, '');
        setMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setPagination(1);
            setRequestCount(requestCount+1);
        }
    };

    /**
     * Handle click on user entry
     */
    const showUser = (username) => {
        navigate(`/user/${username}`, {state:{query: message, pageNumber: page}});
    }

    const getUsers = () => {
        if(users && users.items && users.items.length) {
            
            return  users.items.map((user, idx) => {
                return <p
                    key={idx} 
                    className="list-item" 
                    onClick={() => showUser(user.login, user.avatar_url)}
                    >
                    <strong>{user.login}</strong> - {user.url}
                </p>
            });
        }
        return <p>No results yet.. Try to search something</p>
    }

    /*
    Handle paginaion buttons and actions
    */
    const nextPage = () => {
        setPagination(page + 1);
        setRequestCount(requestCount+1);
    }

    const prevPage = () =>  {
        setPagination(page -1);
        setRequestCount(requestCount+1);
    }

    const renderBtnPrev = () => {
        if (page > 1) {
            return (
                <button onClick={() => prevPage()}>Previous Page</button>
            )
        }
    }

    const renderBtnNext = () => {
        if (hasNext) {
            return (
                <button onClick={() => nextPage()}>Next Page</button>
            )
        }
    }

    
        
    return (
        <Fragment>
            <h1>GitHub User Search</h1>
            <input
                id="query"
                name="query"
                type="text"
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={() => {
                setPagination(1);
                setRequestCount(requestCount+1);
            }}>
                Fetch
            </button>


            <div className="list-container">
                {getUsers()}
            </div>

            <div>
                {renderBtnPrev()}
            </div>

            <div>
                {renderBtnNext()}
            </div>
            
            
        </Fragment>
        
    );

    
    
}

export default Home;