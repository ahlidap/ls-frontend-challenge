import React from "react"
import { Fragment, useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WindmillSpinner } from 'react-spinner-overlay'
import api from "../../services/api"
import Swal from 'sweetalert2'
import UserSearch from './UserSearch'
import UserList from './UserList'
import Pagination from './Pagination'
import './index.scss'

function Home(props) {
    // Check if are coming back from user (ie. location.state exists)
    const location = useLocation();
    let receivedPage, receivedQuery;
    if (location && location.state) {
        receivedPage = location.state.pageNumber;
        receivedQuery = location.state.query;
    }

    const [loading, setLoading] = useState(false);
    const [page, setPagination] = useState(receivedPage ? receivedPage : 1)
    const [lastPage, setLastPage] = useState(1); 
    const [hasNext, setHasNext] = useState(false);
    const [message, setMessage] = useState(receivedQuery ? receivedQuery : "");
    const [users, setUsers] = useState([]);
    const [triggerSearch, setTrigerSearch] = useState(false);
    const  navigate = useNavigate();

    /**
     * Hook to fetch data using GitHub REST API
     * Listens to changes on 'page'
     */
    useEffect(() => {
        if(message.length) {
            //setLoading(true);

            const fetchData = async () => {
                let response = await api.get("search/users", {
                    params: {
                        q: message,
                        per_page: process.env.REACT_APP_ITEMS_PER_PAGE,
                        page: page,
                        sort: "joined",
                        order: "desc"
                    }
                });
                let data = response.data;
                let nPages = Math.ceil(data.total_count / process.env.REACT_APP_ITEMS_PER_PAGE)
                setLastPage(nPages);
                setHasNext( page < nPages);
                setUsers(data);

                const element = document.getElementById('fetch-btn');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            fetchData().catch( error => {
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
            }).finally(() => {
                setLoading(false);

            })
        }
     }, [triggerSearch]);


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
            setTrigerSearch(!triggerSearch);
        }
    };

    /**
     * Handle click on user entry
     */
    const showUser = (username) => {
        navigate(`/user/${username}`, {state:{query: message, pageNumber: page}});
    }    

    const doSearch = () => {
        setPagination(1);
        setTrigerSearch(!triggerSearch);
    }
    
        
    return (
        <Fragment>
            
            <WindmillSpinner size={28} loading={loading}/>


            <UserSearch 
                message = {message}
                handleChange = {handleChange}
                handleKeyDown = {handleKeyDown}
                doSearch = {doSearch}
            />

            <UserList
                users = {users}
                userClickAction = {showUser}
            />

            <Pagination 
                page = {page}
                lastPage = {lastPage}
                hasNext = {hasNext}
                users = {users}
                triggerSearch = {triggerSearch}
                setPagination = {setPagination}
                setTrigerSearch = {setTrigerSearch}
            />
            
            
        </Fragment>
        
    );

    
    
}

export default Home;