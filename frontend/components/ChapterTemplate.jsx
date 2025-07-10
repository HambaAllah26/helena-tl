import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ChapterTemplate = ({ novelId }) => {
  const { chapterNumber } = useParams();
  const [data, setData] = useState({ 
    metadata: null, 
    content: '', 
    loading: true, 
    error: null 
  });

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const metaRes = await import(`../data/json/${novelId}.json`);
        const chapterMeta = metaRes.default.volumes
          .flatMap(volume => volume.chapters)
          .find(ch => ch.number === parseInt(chapterNumber));

        if (!chapterMeta) throw new Error('Chapter not found');

        const contentRes = await fetch(chapterMeta.contentFile);
        const textContent = await contentRes.text();

        setData({
          metadata: {
            ...chapterMeta,
            novelTitle: metaRes.default.title
          },
          content: textContent,
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    loadChapter();
  }, [novelId, chapterNumber]);

  if (data.loading) return <div className="loading">Loading...</div>;
  if (data.error) return (
    <div className="error">
      {data.error} <Link to="/">Return home</Link>
    </div>
  );

  return (
    <div className="chapter-template">
      <header>
        <h1>{data.metadata.novelTitle}</h1>
        <h2>Chapter {chapterNumber}: {data.metadata.chapterTitle}</h2>
        <ChapterNavigation 
          novelId={novelId} 
          currentChapter={parseInt(chapterNumber)} 
          chapters={data.metadata.novelData?.volumes.flatMap(v => v.chapters)} 
        />
      </header>
      <article>
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </article>
    </div>
  );
};

const ChapterNavigation = ({ novelId, currentChapter, chapters }) => {
  const currentIndex = chapters?.findIndex(ch => ch.number === currentChapter) ?? -1;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="chapter-nav">
      {prevChapter && (
        <Link 
          to={`/novel/${novelId}/chapter/${prevChapter.number}`}
          className="nav-button prev"
        >
          ← {prevChapter.chapterTitle}
        </Link>
      )}
      <Link to={`/novel/${novelId}`} className="nav-button toc">
        Table of Contents
      </Link>
      {nextChapter && (
        <Link 
          to={`/novel/${novelId}/chapter/${nextChapter.number}`}
          className="nav-button next"
        >
          {nextChapter.chapterTitle} →
        </Link>
      )}
    </div>
  );
};

export default ChapterTemplate;
