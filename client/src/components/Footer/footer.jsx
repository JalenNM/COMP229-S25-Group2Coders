
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <p>
                        &copy; 2025 Group 2 Coders. All rights reserved.
                    </p>
                </div>
                <div className="footer-right">
                    <Link to="/contact" className="footer-link">Contact</Link>
                </div>
            </div>
        </footer>
    )
}



export default Footer;