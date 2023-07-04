import React, { useEffect } from 'react';
import { apilink, path } from '../../data/fdata';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
const Navbar = () => {
  const atokon = Cookies.get('_fleksa_access_restaurant_tokon_');
  const [login, setLogin] = useState(false);

  useEffect(async () => {
    const res = await axios.get(`${apilink}/auth/isVerify`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (res.data.success) {
      setLogin(true);
    }
  }, []);

  const logout = () => {
    Cookies.remove('_fleksa_access_restaurant_tokon_');
    localStorage.removeItem('_fleksa_access_restaurant_login');
    console.clear();
    window.location.href = '/';
  };
  return (
    <>
      <div className="par_navbar fixed-top">
        <div className="inner_nav">
          <NavLink to="/home" className="logo">
            <img
              src={`${path}/image/fleksa-logo.webp`}
              alt=""
              className="logo_img"
            />
          </NavLink>
          {login && (
            <button className="btn btn-dark" onClick={logout}>
              {' '}
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
