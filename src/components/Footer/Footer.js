import React from 'react';
import './Footer.scss';
import '../../scss/theme.scss';

const Footer = (props) => {
    return (
        <div className={props.theme ? "footer footer-dark" : "footer footer-light"}>
            <div className="logo">
                <i className="fab fa-reddit-alien"></i>
            </div>
            <h1>Reddit Gallery</h1>
            <h3>By Mitchell Wilson</h3>
        </div>
    );
}

export default Footer;