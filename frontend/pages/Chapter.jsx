import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchChapterData } from '../api/chapterApi';
import './Chapter.css';

const Chapter = () => {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    error: null,
    novelTitle: '',
    chapter: null,
    content: '',
    adjacentChapters: { prev: null, next: null }
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadChapterData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const data = await fetchChapterData(novelId, chapterNumber);
        
        setState({
          loading: false,
          error: null,
          novelTitle: data.novelTitle || '',
          chapter: data.chapter,
          content: data.chapter.content,
          adjacentChapters: data.adjacentChapters
        });

      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Chapter loading error:', error);
          setState({
            loading: false,
            error: error.message.includes('Network') 
              ? 'Network error - please check your connection' 
              : error.message,
            novelTitle: '',
            chapter: null,
            content: '',
            adjacentChapters: { prev: null, next: null }
          });
        }
      }
    };

    loadChapterData();
    
    return () => controller.abort();
  }, [novelId, chapterNumber]);


  const handleChapterChange = (newChapterNumber) => {
    navigate(`/novel/${novelId}/chapter/${newChapterNumber}`, { 
      state: { fromNavigation: true } 
    });
  };

  useEffect(() => {
    if (state.chapter?.number === parseInt(chapterNumber)) {
      window.scrollTo(0, 0);
    }
  }, [state.chapter, chapterNumber]);

  if (state.loading) return (
    <div className="chapter-loading">
      <div className="spinner"></div>
      <p>Loading chapter...</p>
    </div>
  );

  if (state.error) return (
    <div className="chapter-error">
      <h2>Error Loading Chapter</h2>
      <p>{state.error}</p>
      <div className="error-actions">
        <Link to="/" className="nav-button">Home</Link>
        {novelId && (
          <Link to={`/novel/${novelId}`} className="nav-button">
            Table of Contents
          </Link>
        )}
        <button 
          onClick={() => window.location.reload()} 
          className="nav-button"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="chapter-container">
      <header className="chapter-header">
        <div className="chapter-breadcrumbs">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to={`/novel/${novelId}`}>{state.novelTitle}</Link>
          <span> / </span>
          <span>Vol. {state.chapter.volumeNumber} Ch. {state.chapter.number}</span>
        </div>
        
        <h1 className="chapter-title">{state.chapter.title}</h1>
        
        <div className="chapter-meta">
          <span className="meta-item">
            Words: {state.chapter.wordCount ? 
              `${Math.round(state.chapter.wordCount / 1000 * 10) / 10}k` : 
              'N/A'}
          </span>
        </div>
      </header>

      <article className="chapter-content">
        <ReactMarkdown>{state.content}</ReactMarkdown>
      </article>

      <footer className="chapter-footer">
        <div className="chapter-navigation">
          {state.adjacentChapters.prev ? (
            <button 
              onClick={() => handleChapterChange(state.adjacentChapters.prev.number)}
              className="nav-button prev"
              aria-label="Previous chapter"
            >
              ← Vol. {state.adjacentChapters.prev.volumeNumber} Ch. {state.adjacentChapters.prev.number}
            </button>
          ) : (
            <div className="nav-button disabled">First Chapter</div>
          )}
          
          <Link to={`/novel/${novelId}`} className="nav-button toc">
            Table of Contents
          </Link>
          
          {state.adjacentChapters.next ? (
            <button
              onClick={() => handleChapterChange(state.adjacentChapters.next.number)}
              className="nav-button next"
              aria-label="Next chapter"
            >
              Vol. {state.adjacentChapters.next.volumeNumber} Ch. {state.adjacentChapters.next.number} →
            </button>
          ) : (
            <div className="nav-button disabled">Latest Chapter</div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Chapter;
