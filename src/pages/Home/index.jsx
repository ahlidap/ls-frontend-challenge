import React from 'react'
import { Fragment, useEffect, useState, useRef} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api'
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

    const loading = useRef(false);
    const [page, setPagination] = useState(receivedPage ? receivedPage : 0)
    const [lastPage, setLastPage] = useState(1); 
    const [hasNext, setHasNext] = useState(false);
    const [message, setMessage] = useState(receivedQuery ? receivedQuery : '');
    const [users, setUsers] = useState([]);
    const [triggerSearch, setTrigerSearch] = useState(false);
    const  navigate = useNavigate();


    // Fetch users data from API
    const fetchData = async () => {
        let response = await api.get('search/users', {
            params: {
                q: message,
                per_page: process.env.REACT_APP_ITEMS_PER_PAGE,
                page: page,
                sort: 'joined',
                order: 'desc'
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


    /**
     * Hook to fetch data using GitHub REST API
     * Listens to changes on 'triggerSearch'
     * triggerSearch used as a trick to handle both pagechanges and new searches from page 1
     */
    useEffect(() => {
        if(message.length && !loading.current) {
            loading.current = true;
            fetchData().catch( error => {
                let errorMessage = 'Oops. Something went wrong!'
                if(error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK!'
                });
            }).finally(() => {
                loading.current = false;

            });
        }
     }, [triggerSearch]);


    /**
     * Handle events on the input
     */
    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    /**
     * Listen for 'Enter' key to call doSearch()
     */
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            doSearch()
        }
    };

    /**
     * Handle click on user entry
     */
    const showUser = (username) => {
        navigate(`/user/${username}`, {state:{query: message, pageNumber: page}});
    }    


    /**
     * Checks if search query has some length and triggers search if necessary
     */
    const doSearch = () => {
        if (!message.length){
            Swal.fire({
                title: 'Oops!',
                text: 'Please type in something to search for.',
                icon: 'info',
                confirmButtonText: 'Sure!'
              });
        } else {
            setPagination(1);
            setTrigerSearch(!triggerSearch);
        }
    }
    
        
    return (
        <Fragment>            
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