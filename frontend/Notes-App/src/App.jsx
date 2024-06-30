import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  return (
    <Router>
    <Routes>
        <Route exact path="/" element= {<Home/>}/>
        <Route path="/login" element= {<Login/>} />
        <Route path="/register" element= {<Signup/>} />
    </Routes>
    </Router>
 
  );
}

export default App;

