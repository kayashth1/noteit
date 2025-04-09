import React from 'react';
import './Nav.css';
import { useNavigate } from 'react-router-dom';

function Nav({ userInfo, setSearchQuery }) {
  const navigate = useNavigate();

  const [searchText, setSearchText] = React.useState('');

  const handleLogout = () => {
    // Add logout logic here
    localStorage.clear();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchQuery('');
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <h1>noteit</h1>
      </div>
      <div className="nav-middle">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="search-input"
        />
        <button onClick={clearSearch} className="clear-button">{searchText.length !== 0 && '✖'}</button>
      </div>
      <div className="nav-right">
        <span>
          {userInfo?.fullName}
        </span>
        <button className="nav-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Nav;
