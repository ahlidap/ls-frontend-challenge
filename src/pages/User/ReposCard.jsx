import React from "react"
import { Fragment, useEffect, useState} from "react";
import api from "../../services/api"
import Swal from 'sweetalert2'
import "./reposcard.scss"

function ReposCard (props) {
    console.log(props)
    const [repos, setRepos] = useState([]);
    const [page, setPagination] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    
    useEffect(() => {
        api.get(`users/${props.userData.login}/repos`, {
            params: {
                per_page: process.env.REACT_APP_ITEMS_PER_PAGE,
                page: page,
                sort: "updated",
                order: "desc"
            }
        })
        .then((response) => {
            let data = response.data;
            if (!data.length) {
                setHasNext(false);
            }
            setRepos(repos.length ? repos.concat(data) : data);
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
    },[page]);

    const handleScroll = (event) => {
        let container = event.target;
        if (hasNext && (container.offsetHeight + container.scrollTop >= container.scrollHeight)) {
            setPagination(page+1);
        }
    }


    const getRepoList = () => {
        if(repos && repos.length) {
            
            return  repos.map((repo, idx) => {
                return <div 
                    key={idx}
                    className={ (repos.length == idx+1) ? "repo-entry last-entry" : "repo-entry"}
                    onClick={() => {window.open(repo.html_url, "_blank", "noreferrer");}}
                    >
                    
                    <span className="repo-name">{repo.name}</span>
                    <span>{repo.description}</span>
                </div>
            });
        }
        return <p>No repos found.</p>
    }

    return(
        <div className="repo-card" onScroll={handleScroll}>
            {getRepoList()}
        </div>
    );   
}


export default ReposCard;