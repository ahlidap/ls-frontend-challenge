import React from 'react'
import { Fragment, useEffect, useState, useRef} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api'
import Swal from 'sweetalert2'
import UserCard from './UserCard'
import ReposCard from './ReposCard'

function Show (props) {
    const loading = useRef(false);
    const [userData, setUserData] = useState();
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    // Fetch user info from API
    const fetchData = async () => {
        const response = await api.get(`users/${username}`);
        let data = response.data;
        setUserData(data);
    }

    useEffect(() => {
        if (!loading.current) {
            loading.current = true;
            fetchData().catch(error => {
                let errorMessage = 'Oops. Something went wrong!'
                if(error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK, I\'ll wait!'
                });
            }).finally( () => {
                loading.current = false;
            });
        }
    }, []);

    /**
     * Handle going back to search page
     * Previously received 'username' and 'page' are sent back to achieve previous state
     */
    const goBack = () => {
        navigate(`/`, {state:{query: location.state.query, pageNumber: location.state.pageNumber}});
    }
    
    /**
     * Render user data
     */
    const renderUserData = () => {
        if (userData && userData.login) {
            return (           
                <>
                    <UserCard
                        userData={userData}
                    />
                </>
            );    
        } else {
            return (
                <div className='base-card'>
                    <center><h1>User not found</h1></center>
                </div>
            )
        }
    }

    /**
     * Render Repos data
     */
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
                <div 
                    className='btn2'
                    onClick={() => {goBack()}}
                >⬅ GO BACK</div>
                {renderUserData()}
                {renderReposCard()}
            </Fragment>
        
    );   
}


export default Show;