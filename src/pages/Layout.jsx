import { Outlet, Link, useLocation } from "react-router-dom";
import Container from '../components/Container';
import './layout.scss';
let logo = require('../assets/logo.png');

function Layout () {
    const location = useLocation();
    console.log('my location', location)
    return(
        <>
            <nav>
                <div id="nav-bar" className="nav-bar">
                    <Link to="/">
                        <img className="logo" src={logo} alt="logo"  />
                    </Link>
                    <div className={location.pathname === "/" ? "selected navlink" : "navlink"}>
                        <Link to="/">Home</Link>
                    </div>
                    <div className={location.pathname === "/about" ? "selected navlink" : "navlink"} >
                        <Link to="/about">About</Link>
                    </div>
                </div>
            </nav>

            <Container>
                <Outlet />
            </Container>
        </>
    );   
}


export default Layout;