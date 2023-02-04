let tuxGif = require('../../assets/tux.gif');

function NotFound () {
    return(
        <div>
            <h1>Are you lost..?</h1>
            <img src={tuxGif} alt='404 gif' />
        </div>
        
    );   
}


export default NotFound;