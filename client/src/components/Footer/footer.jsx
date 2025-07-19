
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="text-left">
                    &copy; {new Date().getFullYear()} Copyright <br />
                    Group 2 Coders. All rights reserved.
                </p>
                <p className="text-left">
                    <Link to="/contact" className="footer-link">Contact</Link>
                </p>
            </div>
        </footer>
    )
}



export default Footer;