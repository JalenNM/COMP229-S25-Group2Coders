/*
  FileName: App.jsx
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import { useEffect, useState } from 'react';
import { Link, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/home';
import About from './pages/about';
import AboutDetail from './pages/About-details';
import Contact from './pages/contact';
import Projects from './pages/projects';
import Register from './pages/register';
import Login from './pages/login';
import ProjectList from './pages/project-list';
import ProjectDetails from './pages/project-details';
import ProjectRead from './pages/project-read';
import Admin from './pages/admin';
import AdminUserView from './pages/adminUserView';

function App() {
  const getUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return token && username ? { token, username, role } : null;
  };

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {/* fixed Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">My Portfolio</Link>
            
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
                {/* Admin panel page*/}
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-danger fw-bold" to="/admin">Admin Panel</Link>
                  </li>
                )}
              </ul>

              <ul className="navbar-nav ms-auto">
                {user ? (
                  <>
                    <li className="nav-item d-flex align-items-center">
                      <span className="navbar-text me-3">Welcome, {user.username}</span>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content area with padding to avoid navbar overlap */}
        <div style={{ paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-details" element={<AboutDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path='/projects' element={<ProjectList />} />
            <Route path="/project-details/:id?" element={<ProjectDetails />} />
            <Route path="/project-read/:id" element={<ProjectRead />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user/:id" element={<AdminUserView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;