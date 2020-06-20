import React from 'react';
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import TweepsList from "./TweepsList";
const appName = 'Twitter Rank';
const BASE_URL = 'http://127.0.0.1:3333';
const user = {
};


function App() {
  return (
      <div className="main-content">
       <Header user={user} appName={appName}/>
       <br/>
          <link href="//cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css" rel="stylesheet"/>
       <TweepsList api={BASE_URL}/>
       <Footer appName={appName}/>
      </div>
  );
}

export default App;
