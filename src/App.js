import React from 'react';
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import TweepsList from "./TweepsList";
require('dotenv').config();

const appName = process.env.REACT_APP_NAME || 'Twitter Rank';

// sample user
const user = {
  id: 1,
  name:'djunehor'
};


function App() {
  return (
      <div className="main-content">
       <Header user={user} appName={appName}/>
       <br/>
          <link href="//cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css" rel="stylesheet"/>
       <TweepsList />
       <Footer appName={appName}/>
      </div>
  );
}

export default App;
