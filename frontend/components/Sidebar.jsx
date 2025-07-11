import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import './Sidebar.css';
import profilePic from '../assets/helena.png';

const VolumeDropdown = React.memo(({ title, children, isInitiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <div className="sidebar-volume-dropdown">
      <div className="sidebar-volume-header" onClick={toggle}>
        {title}
        <span className="sidebar-volume-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="sidebar-volume-content">{children}</div>}
    </div>
  );
});

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadNovels = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiPath = import.meta.env.VITE_SIDEBAR_API_PATH || '/sidebar.php';
        
        const response = await apiClient.get(apiPath, {
          signal: controller.signal,
          timeout: 10000,
          // baseURL: '/helena-tl/api' //
        });

        if (!response?.novels) {
          throw new Error('Invalid data structure received');
        }

        setNovels(response.novels);
      } catch (err) {
        if (!controller.signal.aborted) {
          const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.error || err.message
            : err.message;
          
          setError(errorMessage);
          console.error('Sidebar API Error:', {
            error: err,
            config: err.config,
            response: err.response
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadNovels();

    return () => controller.abort();
  }, []);

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <div className="sidebar-loading">
          <div className="spinner"></div>
          <p>Loading novels...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="sidebar-error">
          <p>Error loading navigation: {error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <Link to="/" className="home-button">
            Return Home
          </Link>
        </div>
      );
    }

    return (
      <nav>
        <ul>
          <li>
            <Link to="/" className="nav-homebutton" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          {novels.map((novel) => (
            <NovelItem 
              key={novel.novel_id} 
              novel={novel} 
              onClose={() => setIsOpen(false)}
            />
          ))}
        </ul>
      </nav>
    );
  }, [loading, error, novels]);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} aria-hidden={!isOpen}>
        <div className="profile">
          <img src={profilePic} alt="Profile" className="profile-image" />
          <h2 className="profile-name">Helena TL</h2>
        </div>
        {renderContent()}
      </aside>
    </>
  );
};

const NovelItem = React.memo(({ novel, onClose }) => (
  <li>
    <VolumeDropdown title={novel.title} isInitiallyOpen={true}>
      <ul className="submenu">
        {novel.volumes.map((volume) => (
          <VolumeItem 
            key={`vol-${volume.id}`} 
            volume={volume} 
            novelId={novel.novel_id}
            onClose={onClose}
          />
        ))}
      </ul>
    </VolumeDropdown>
  </li>
));

const VolumeItem = React.memo(({ volume, novelId, onClose }) => (
  <li>
    <VolumeDropdown
      title={`Volume ${volume.number}: ${volume.title || ''}`}
    >
      <ul className="submenu chapter-list">
        {volume.chapters.map((chapter) => (
          <ChapterItem
            key={`ch-${chapter.id}`}
            chapter={chapter}
            novelId={novelId}
            onClose={onClose}
          />
        ))}
      </ul>
    </VolumeDropdown>
  </li>
));

const ChapterItem = React.memo(({ chapter, novelId, onClose }) => (
  <li>
    <Link
      to={`/novel/${novelId}/chapter/${chapter.number}`}
      onClick={onClose}
      className="nav-link"
    >
      <div className="chapter-title-full">
        <span className="chapter-number">Ch. {chapter.number}:</span>
        <span className="chapter-title-text"> {chapter.title}</span>
      </div>
    </Link>
  </li>
));

export default Sidebar;
