import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import profilePic from '../assets/helena.png';

function VolumeDropdown({ title, children, isInitiallyOpen = false }) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  return (
    <div className="sidebar-volume-dropdown">
      <div className="sidebar-volume-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className="sidebar-volume-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="sidebar-volume-content">{children}</div>}
    </div>
  );
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const novelModules = await Promise.all(
          Object.entries(import.meta.glob('../data/json/*.json')).map(
            async ([path, module]) => {
              const novel = (await module()).default;
              return {
                ...novel,
                title: novel.novelTitle || novel.title,
                volumes: novel.volumes.map(volume => ({
                  ...volume,
                  chapters: volume.chapters.map(chapter => ({
                    ...chapter,
                    chapterTitle: chapter.chapterTitle || chapter.title || `Chapter ${chapter.number}`
                  }))
                }))
              };
            }
          )
        );

        setNovels(novelModules);
      } catch (error) {
        console.error('Error loading novel data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNovels();
  }, []);

  if (loading) {
    return <div className="sidebar-loading">Loading novels...</div>;
  }

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
              <Link to="/" className="nav-homebutton" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            
            {novels.map((novel) => (
              <li key={novel.novelId}>
                <VolumeDropdown 
                  title={`${novel.title}`}
                  isInitiallyOpen={true}
                >
                  <ul className="submenu">
                    {novel.volumes.map((volume) => (
                      <li key={`${novel.novelId}-vol${volume.number}`}>
                        <VolumeDropdown 
                          title={`Volume ${volume.number}: ${volume.title || ''}`}
                        >
                          <ul className="submenu chapter-list">
                            {volume.chapters.map((chapter) => (
                              <li key={`${novel.novelId}-ch${chapter.number}`}>
                                <Link
                                  to={`/novel/${novel.novelId}/chapter/${chapter.number}`}
                                  onClick={() => setIsOpen(false)}
                                  className="nav-link"
                                >
                                  <div className="chapter-title-full">
                                    <span className="chapter-number">Ch. {chapter.number}:</span>
                                    <span className="chapter-title-text"> {chapter.chapterTitle}</span>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </VolumeDropdown>
                      </li>
                    ))}
                  </ul>
                </VolumeDropdown>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
