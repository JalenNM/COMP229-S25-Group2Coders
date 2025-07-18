import { Link, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';

import Home from './pages/home';
import About from './pages/about';
import Profile from './pages/profile';
import Contact from './pages/contact';
import MovieList from './pages/movie-list';
import MovieDetails from './pages/movie-details';
import Register from './pages/register';
import Login from './pages/login';
import AdminPanel from './pages/admin-panel';
import AdminUsers from './pages/admin-users';
import Footer from "./components/Footer/footer";

function App() {
  const getUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        return { ...user, token, isAdmin: user.role === 'admin'};
      } catch (err) {
        console.error("Failed to parse user from storage", err);
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState(() => getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">FlickBuzz</Link>
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

            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/movies">Movies</Link></li>
                {user?.role === 'admin' && (
                  <li className="nav-item"><Link className="nav-link" to="/admin-panel">Admin Panel</Link></li>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {user ? (
                  <>
                    <li className="nav-item d-flex align-items-center">
                      <span className="navbar-text me-3">Welcome, {user.username}</span>
                    </li>
                    <li className="nav-item d-flex align-items-center">
                      <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* All routes are inside the main app container now */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/movies" element={<MovieList user={user} />} />
          <Route path="/movies/:id" element={<MovieDetails user={user} />} />
          <Route path="/movie-details/:id?" element={<MovieDetails user={user} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin-panel" element={<AdminPanel user={user} />} />
          <Route path="/admin-panel/users" element={<AdminUsers user={user} />} />
          <Route path="*" element={
            <div className="text-center mt-5">
              <h2>404 - Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
