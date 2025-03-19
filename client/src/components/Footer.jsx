import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row text-center text-md-left">

          {/* Contact Us Section */} 
          <div className="col-md-4 mb-4 ">
            <h5 className="text-uppercase fw-bold">Contact Us</h5>
            <p>Email: <a href="mailto:anyone@gmail.com" className="text-light">anyone@gmail.com</a></p>
            <p>Phone: +9411223344</p>
            <p>Address: Malabe, Colombo</p>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Feedback</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Contact Us</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">About Us</Link></li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="col-md-4 mb-4 text-center">
            <h5 className="text-uppercase fw-bold">Follow Us</h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <a href="#" className="text-light fs-4"><FaFacebook /></a>
              <a href="#" className="text-light fs-4"><FaInstagram /></a>
              <a href="#" className="text-light fs-4"><FaTwitter /></a>
              <a href="#" className="text-light fs-4"><FaLinkedin /></a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom text-center pt-3 mt-4 border-top border-light">
          <p className="mb-0">
            Copyright ©2024 | Designed by <strong>Ceylon Odyssey</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
