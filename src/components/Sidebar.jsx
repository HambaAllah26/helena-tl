import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import profilePic from '../assets/helena.png';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [showVolumes, setShowVolumes] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleVolumes = () => {
    setShowVolumes(!showVolumes);
  };

  const toggleChapters = () => {
    setShowChapters(!showChapters);
  };

  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside 
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        aria-hidden={!isOpen}
      >
        <div className="profile">
          <img src={profilePic} alt="Profile" />
          <h2>Helena TL</h2>
        </div>

        <nav>
          <ul>
            <li>
              <button className="link-button" onClick={() => setIsOpen(false)}>
                Home
              </button>
            </li>
            <li className="dropdown">
              <button 
                onClick={toggleVolumes} 
                className="link-button"
                aria-expanded={showVolumes}
              >
                Ponkotsu Witch's Domestic Affair
                <span className="dropdown-arrow">
                  {showVolumes ? ' ▼' : ' ▶'}
                </span>
              </button>
              {showVolumes && (
                <ul className="volume-list">
                  <li className="volume-item">
                    <button 
                      className="volume-button"
                      onClick={toggleChapters}
                      aria-expanded={showChapters}
                    >
                      Volume 1
                      <span className="dropdown-arrow">
                        {showChapters ? ' ▼' : ' ▶'}
                      </span>
                    </button>
                    {showChapters && (
                      <ul className="chapter-list">
                        <li>
                          <a href="/chapter1" onClick={() => setIsOpen(false)}>
                            Chapter 1
                          </a>
                        </li>
                        <li>
                          <a href="/chapter2" onClick={() => setIsOpen(false)}>
                            Chapter 2
                          </a>
                        </li>
                        <li>
                          <a href="/chapter3" onClick={() => setIsOpen(false)}>
                            Chapter 3
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  {/* Add more volumes here if needed */}
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
