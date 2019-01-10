import React from 'react';
import logo from '../../assets/images/logo.svg';

import './index.scss';

const Home = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>Acesse o painel clicando no link abaixo.</p>
      <a className="App-link" href="login">Entrar</a>
    </header>
  </div>
);

export default Home;
