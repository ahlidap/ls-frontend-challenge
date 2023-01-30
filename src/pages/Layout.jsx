import { Outlet, Link } from "react-router-dom";
import Container from '../components/Container';
import './layout.scss';

function Layout () {
    return(
        <>
            <nav>
                <div className="navlink" >
                    <Link to="/">Home</Link>
                </div>
                <div className="navlink" >
                    <Link to="/about">About</Link>
                </div>
            </nav>

            <Container>
                <Outlet />
            </Container>
        </>
    );   
}


export default Layout;