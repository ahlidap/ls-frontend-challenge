import './App.css';
import {BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from './pages/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Show from './pages/User'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:username" element={<Show />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



export default App;
