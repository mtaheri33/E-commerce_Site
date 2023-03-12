import React, { Component } from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Home from './components/home';
import SignUp from './components/signUp';
import SignIn from './components/signIn';
import Marketplace from './components/marketplace';
import Cart from './components/cart';
import Checkout from './components/checkout';
import Orders from './components/orders';
import Products from './components/products';
import Product from './components/product';
import Ratings from './components/ratings';
import NotFound from './components/notFound';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:productId' element={<Product />} />
          <Route path='/ratings' element={<Ratings />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    )
  }
}

export default App;