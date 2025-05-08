import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import profilePic from '../assets/helena.png'; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [expandedItems, setExpandedItems] = useState({
    volumes: false,
    chapters: false
  });

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
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
              <button className="nav-button" onClick={() => setIsOpen(false)}>
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => toggleExpanded('volumes')} 
                className="nav-button dropdown-button"
              >
                <span>Ponkotsu Witch's Domestic Affair</span>
                <span className="dropdown-arrow">
                  {expandedItems.volumes ? '▼' : '▶'}
                </span>
              </button>

              {expandedItems.volumes && (
                <ul className="submenu">
                  <li>
                    <button 
                      className="nav-button dropdown-button"
                      onClick={() => toggleExpanded('chapters')}
                    >
                      Volume 1
                      <span className="dropdown-arrow">
                        {expandedItems.chapters ? '▼' : '▶'}
                      </span>
                    </button>

                    {expandedItems.chapters && (
                      <ul className="submenu chapter-list">
                        {[1, 2, 3].map((chapter) => (
                          <li key={chapter}>
                            <a 
                              href={`/chapter${chapter}`}
                              onClick={() => setIsOpen(false)}
                              className="nav-link"
                            >
                              Chapter {chapter}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
