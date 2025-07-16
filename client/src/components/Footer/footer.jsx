import React from 'react'
import './footer.css'

const Footer = () => {
    return (
        
<footer className="footer">
<div className="container">
  <p className="text-left">
    &copy; {new Date().getFullYear()} Copyright <br>
    </br>
    Group 2 Coders. All rights reserved.
  </p>
</div>
</footer>
    )
}



export default Footer;