import './Home.css';
import introImg from '../assets/introImg.png';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="container d-flex justify-content-center align-items-center flex-column text-center">
        <div className="row align-items-center flex-column-reverse flex-md-row w-100">
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="mb-4 fw-bold">Welcome !</h1>
            <h4 className="mb-4">
              This is a user management system.
            </h4>
            <Link to="/contact">
              <button className="btn btn-primary btn-lg">Contact Me</button>
            </Link>
          </div>

          <div className="col-md-6 text-center">
            <img
              src={introImg}
              alt="Developer illustration"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
