import { useEffect, useState } from 'react';
import { Link, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Projects from './pages/projects';
import Services from './pages/services';
import Register from './pages/register';
import Login from './pages/login';

function App() {

  // Function to get user data from localStorage
  const getUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { token, username } : null;
  }

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className='navbar-brand' to="/">My Portfolio</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className='nav-link' to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/projects">Projects</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/contact">Contact</Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {user ? (
                <>
                  <li className='nav-item d-flex align-items-center'>
                    <span className="navbar-text me-3">Welcome, {user.username}</span>
                  </li>
                  <li className='nav-item d-flex align-items-center'>
                    <button className="btn btn-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className='nav-link' to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className='nav-link' to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/projects' element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
