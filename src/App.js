import React, { useEffect, useState } from 'react';
import 'swiper/swiper.min.css';
import { Switch, Route } from 'react-router-dom';

import Error from './pages/Error';

import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home/Home';
import Navbar from './component/navbar/Navbar';
import Footer from './component/footer/Footer';
import OrderDet from './pages/home/OrderDet';

const App = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/orderdet/:orderid" component={OrderDet} />

        <Route component={Error} />
      </Switch>
      <Footer />
    </>
  );
};

export default App;
