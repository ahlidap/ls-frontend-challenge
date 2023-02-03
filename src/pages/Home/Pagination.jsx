import React from "react"
import "./pagination.scss"

function Pagination (props) {
    const setPagination = props.setPagination;
    const page = props.page;
    const lastPage = props.lastPage;
    const users = props.users;
    const triggerSearch = props.triggerSearch;
    const setTrigerSearch = props.setTrigerSearch;
    const hasNext = props.hasNext;
    
    const nextPage = () => {
        setPagination(page + 1);
        setTrigerSearch(!triggerSearch);
    }

    const prevPage = () =>  {
        setPagination(page -1);
        setTrigerSearch(!triggerSearch);
    }

    const renderBtnPrev = () => {
        let renderObj;
        if (page > 1) {
            renderObj = (
                <div>
                    <button className="prev-btn btn1" onClick={() => prevPage()}>Previous Page</button>
                </div>
            )
        } else {
            renderObj = (
                <div>
                    &nbsp;
                </div>
            )
        }

        return renderObj;
    }

    const renderBtnNext = () => {
        let renderObj;
        if (hasNext) {
            renderObj = (
                <div>
                    <button className="next-btn btn1" onClick={() => nextPage()}>Next Page</button>
                </div>
            )
        } else {
            renderObj = (
                <div>
                    &nbsp;
                </div>
            )
        }

        return renderObj;
    }

    const renderPaginationStatus = () => {
        if (users && users.items && users.items.length) {
            return (
                <div>
                    {page} / {lastPage}
                </div>
            )
        }
    }


    return(
        <div className="pagination">
            {renderBtnPrev()}
            {renderPaginationStatus()}
            {renderBtnNext()}
        </div>
    );   
}


export default Pagination;