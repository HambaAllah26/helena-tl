import React, { useState } from 'react';
import './Sidebar.css';
import profilePic from '../assets/helena.png'; // Replace with actual profile image

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showChapters, setShowChapters] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleChapters = () => {
    setShowChapters(!showChapters);
  };

  return (
    <>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="profile">
          <img src={profilePic} alt="Profile" />
          <h2>Helena TL</h2>
        </div>

        <nav>
          <ul>
            <li><button className="link-button">Home</button></li>
            <li className="dropdown">
              <button onClick={toggleChapters}>
                Ponkotsu Witch's Domestic Affair
              </button>
              {showChapters && (
                <ul className="chapter-list">
                  <li><a href="/chapter1">Chapter 1</a></li>
                  <li><a href="/chapter2">Chapter 2</a></li>
                  <li><a href="/chapter3">Chapter 3</a></li>
                  {/* Add more chapters as needed */}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;

