import React from 'react'
import { useEffect, useState, useRef} from 'react';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import api from '../../services/api'
import Swal from 'sweetalert2'
import './reposcard.scss'

function ReposCard (props) {
    const [repos, setRepos] = useState([]);
    const [page, setPagination] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const loading = useRef(false);

    /**
     * handles Scroll for infine scroll
     */
    const handleScroll = () => {
        if (hasNext && !loading.current) {
            setPagination(page+1);
        }
    }
    useBottomScrollListener(handleScroll, {
        offset: 200 // offset to fire event before reaching bottom of page
    });
    
    // Fetch repos data from API
    const fetchRepos = async () => {
        if (!loading.current) {
            loading.current = true;
            let response = await api.get(`users/${props.userData.login}/repos`, {
                params: {
                    per_page: process.env.REACT_APP_ITEMS_PER_PAGE,
                    page: page,
                    sort: 'updated',
                    order: 'desc'
                }
            });

            let data = response.data;
            if (!data.length) {
                setHasNext(false);
            }

            setRepos(repos => repos.length ? repos.concat(data) : data);
            loading.current = false;
        }
    }

    

    useEffect(() => {
        fetchRepos(page)
        .catch(error => {
            loading.current = false;
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
        });
    },[page, props.userData.login]);

    /**
     * Process data for rendering
     */
    const renderRepoList = () => {
        if(repos && repos.length) {
            
            return  repos.map((repo, idx) => {
                return <div 
                    data-testid='repo-entry'
                    key={idx}
                    className='repo-entry'
                    onClick={() => {window.open(repo.html_url, '_blank', 'noreferrer');}}
                    >
                    
                    <div className='repo-name'>{repo.name}</div>
                    <div>{repo.description}</div>
                </div>
            });
        }
        return <p><center>No repos found.</center></p>
    }

    return(
        <div
            id='repo-card'
            className='base-card repo-card'
            data-testid='repo-card'
            onScroll={handleScroll}>
            
            <div className='repo-header'>
                <div className='repo-col'>Name</div>
                <div className='repo-col'>Description</div>
            </div>
            <div>
                {renderRepoList()}
            </div>
        </div>
    );   
}


export default ReposCard;