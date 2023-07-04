import React from 'react';
import './Auth.css';
import { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { apilink } from '../../data/fdata';
import Cookies from 'js-cookie';
import { CircularProgress } from '@mui/material';
const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const his = useHistory();

  const onSub = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      phone,
      password,
    };

    const res = await axios.post(`${apilink}/api/v1/restaurant/login`, data);
    // console.log(res.data);
    if (res.data.success) {
      localStorage.setItem('_fleksa_access_restaurant_login', true);

      Cookies.set('_fleksa_access_restaurant_tokon_', res.data.access_token, {
        expires: 24,
      });

      window.location.href = '/home';
    } else {
      setMsg(res.data.msg);
      setStatus(true);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="auth">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-9 col-12 mx-auto">
              <div className="card p-3">
                {status ? (
                  <>
                    <div class="alert alert-warning alert-dismissible">
                      <button
                        type="button"
                        class="close"
                        data-dismiss="alert"
                        onClick={() => setStatus(false)}
                      >
                        &times;
                      </button>
                      {msg}
                    </div>
                  </>
                ) : null}
                <h3>Login</h3> <br />
                <form onSubmit={onSub}>
                  <div class="form-group">
                    <input
                      type="tel"
                      class="form-control"
                      name="phone"
                      placeholder="Enter Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      name="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      className={loading ? 'dis btn btn-dark' : 'btn btn-dark'}
                      disabled={loading}
                    >
                      Login
                    </button>
                  </div>
                  {loading && (
                    <div className="text-center p-2">
                      <CircularProgress size={35} />
                    </div>
                  )}
                  <NavLink to="/register">Register</NavLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
