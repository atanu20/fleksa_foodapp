import React from 'react';
import './Auth.css';
import { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { apilink } from '../../data/fdata';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const his = useHistory();

  const onSub = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      phone,
      address,
      password,
    };

    const res = await axios.post(`${apilink}/api/v1/restaurant/register`, data);
    // console.log(res.data);
    if (res.data.success) {
      setMsg(res.data.msg);
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
        his.push('/');
      }, 3000);
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
                    <div class="alert alert-success alert-dismissible">
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

                <h3>Register</h3>
                <br />

                <form onSubmit={onSub}>
                  <div class="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Restaurant Name"
                      class="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                  <div class="form-group">
                    <textarea
                      name="address"
                      id=""
                      class="form-control"
                      rows="3"
                      placeholder="Enter Full Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button
                      className={loading ? 'dis btn btn-dark' : 'btn btn-dark'}
                      disabled={loading}
                    >
                      Register
                    </button>
                  </div>
                  {loading && (
                    <div className="text-center p-2">
                      <CircularProgress size={35} />
                    </div>
                  )}
                  <NavLink to="/">Login</NavLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
