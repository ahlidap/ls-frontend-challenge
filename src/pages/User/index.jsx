import React from "react"
import { Fragment, useEffect, useState} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api"
import Swal from 'sweetalert2'
import UserCard from "./UserCard"
import ReposCard from "./ReposCard"

function Show (props) {
    const [userData, setUserData] = useState();
    const { username } = useParams();

    const location = useLocation();
    const navigate = useNavigate();
    console.log('my location', location)

    useEffect(() => {
        api.get(`users/${username}`)
        .then((response) => {
            let data = response.data;
            setUserData(data);
        }).catch((error) => {
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
    }, [username]);

    /**
     * Handle going back to search page
     * Previously received 'username' and 'page' are sent back to achieve previous state
     */
    const goBack = () => {
        navigate(`/`, {state:{query: location.state.query, pageNumber: location.state.pageNumber}});
    }
    
    /**
     * Renders Back Btn and user data
     * 
     */
    const renderUserData = () => {
        if (userData && userData.login) {
            return (           
                <>
                    <div 
                        className="go-back"
                        onClick={() => {goBack()}}
                    >⬅ GO BACK</div>

                    <h1 className="user-info">User info</h1>
                    
                    <UserCard
                        userData={userData}
                    />
                </>
            );    
        } else {
            return (
                <h1>User not found</h1>
            )
        }
    }

    const renderReposCard = () => {
        if (userData && userData.login) {
            return (           
                <ReposCard
                    userData={userData}
                />
            );    
        }
    }
    
    return(
        
            <Fragment>
                {renderUserData()}
                {renderReposCard()}
            </Fragment>
        
    );   
}


export default Show;