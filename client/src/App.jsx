import { Link, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Projects from './pages/projects';
import Services from './pages/services';

function App() {
  return (<>
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
              <li className="nav-item">Register</li>
              <li className="nav-item">Login</li>
            </ul>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/projects' element={<Projects />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  </>)
}

export default App;