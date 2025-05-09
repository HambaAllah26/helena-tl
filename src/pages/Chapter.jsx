import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Chapter.css';

const Chapter = () => {
  const { novelId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    novel: null,
    chapter: null,
    content: '',
    loading: true,
    error: null,
    adjacentChapters: { prev: null, next: null }
  });

  useEffect(() => {
    const loadChapterData = async () => {
      try {
        const novelRes = await import(`../data/json/${novelId}.json`);
        const novel = novelRes.default;
        
        const allChapters = novel.volumes.flatMap(volume => 
          volume.chapters.map(chapter => ({
            ...chapter,
            volumeNumber: volume.number,
            volumeTitle: volume.title || `Volume ${volume.number}`
          }))
        );

        const chapter = allChapters.find(ch => ch.number === parseInt(chapterNumber));
        if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

        let content;
        if (chapter.contentFile.startsWith('/')) {
          const contentRes = await fetch(chapter.contentFile);
          if (!contentRes.ok) throw new Error(`Failed to load: ${chapter.contentFile}`);
          content = await contentRes.text();
        } else {
          try {
            const markdown = await import(/* @vite-ignore */ `../data/md/${novelId}/${chapter.contentFile}?raw`);
            content = markdown.default;
          } catch (e) {
            throw new Error(`Failed to load chapter content: ${e.message}`);
          }
        }

        const currentIndex = allChapters.findIndex(ch => ch.number === parseInt(chapterNumber));
        const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
        const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

        setState({
          novel,
          chapter,
          content,
          loading: false,
          error: null,
          adjacentChapters: { prev: prevChapter, next: nextChapter }
        });

      } catch (error) {
        console.error('Chapter loading error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message.includes('Failed to fetch') 
            ? 'Chapter content not found' 
            : error.message
        }));
      }
    };

    loadChapterData();
  }, [novelId, chapterNumber]);

  const handleChapterChange = (newChapterNumber) => {
    navigate(`/novel/${novelId}/chapter/${newChapterNumber}`);
    window.scrollTo(0, 0);
  };

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
        <Link to={`/novel/${novelId}`} className="nav-button">Table of Contents</Link>
      </div>
    </div>
  );

  return (
    <div className="chapter-container">
      <header className="chapter-header">
        <div className="chapter-breadcrumbs">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to={`/novel/${novelId}`}>{state.novel.title}</Link>
          <span> / </span>
          <span>Vol. {state.chapter.volumeNumber} Ch. {state.chapter.number}</span>
        </div>
        
        <div className="chapter-display-title">{state.chapter.title}</div>
        
        <div className="chapter-meta">
          {state.chapter.wordCount && (
            <span className="meta-item">
              Words: {Math.round(state.chapter.wordCount / 100) / 10}k
            </span>
          )}
          {state.chapter.releaseDate && (
            <span className="meta-item">
              Released: {new Date(state.chapter.releaseDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>

      <article className="chapter-content">
        <ReactMarkdown>{state.content}</ReactMarkdown>
      </article>

      <footer className="chapter-footer">
        <div className="chapter-navigation">
          {state.adjacentChapters.prev && (
            <button 
              onClick={() => handleChapterChange(state.adjacentChapters.prev.number)}
              className="nav-button prev"
            >
              ← {state.adjacentChapters.prev.chapterTitle}
            </button>
          )}
          
          <Link to={`/novel/${novelId}`} className="nav-button toc">
            Table of Contents
          </Link>
          
          {state.adjacentChapters.next && (
            <button
              onClick={() => handleChapterChange(state.adjacentChapters.next.number)}
              className="nav-button next"
            >
              {state.adjacentChapters.next.chapterTitle} →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Chapter;
