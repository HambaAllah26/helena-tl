import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNovelData } from '../api/novelApi';
import './Ponkotsu-syn.css';
import FooterSyn from '../components/FooterSyn';

function VolumeDropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="volume-dropdown">
      <div className="volume-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className="volume-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="volume-content">{children}</div>}
    </div>
  );
}

function PonkotsuSyn() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    novelInfo: {
      id: '',
      title: '',
      author: 'Hazuki Kujou - 九條葉月'
    },
    volumes: []
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadNovelData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const data = await fetchNovelData('meta-ponkotsu', {
          signal: controller.signal
        });

        setState({
          loading: false,
          error: null,
          novelInfo: {
            ...state.novelInfo,
            id: data.novelId,
            title: data.title || 'I Become Oda Nobunaga\'s Wife'
          },
          volumes: data.volumes || []
        });

      } catch (error) {
        if (!controller.signal.aborted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message.includes('Network') 
              ? 'Network error - please check your connection'
              : error.message
          }));
        }
      }
    };

    loadNovelData();
    return () => controller.abort();
  }, []);

  const synopsisDetails = [
    "※ It won the 'Finalist' award at the 5th Earth Star Novel Grand Prize and has been decided to be published!",
    "The clumsy witch falls in love at first sight with Oda Nobunaga.",
    "I leave the battles to my husband (Nobunaga) and work hard on domestic affairs cheats!",
    "I reincarnated into another world for various reasons. Since I mastered magic, I decided to return to modern Japan.",
    "...Well, I made a little mistake and ended up in the Sengoku period.",
    "Huh!? I've become Kichi? The one who becomes Nobunaga's wife!? It's a mistake... How did this happen?",
    "Well, if I avoid the incident at Honno-ji, I'll be the wife of the ruler, so until then, while using domestic and military cheats, I'll lead a slow life—uh, husband? Could you stop trying to bring us into the spotlight of history?",
    "* Since getting too detailed can be confusing, I will use widely known names in this work."
  ];

  const nameExamples = [
    "Saito Toshimasa → Saito Dosan",
    "Sanada Nobushige → Sanada Yukimura",
    "Akechi Koreto Hyuga no Kami → Akechi Mitsuhide",
    "Kazusa no Suke-sama → Nobunaga-sama"
  ];

  const visualExamples = [
    "Takeda Shingen's shaved head, Maeda Keiji, and so on."
  ];

   if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading novel information...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="error-container">
        <h2>Error Loading Novel</h2>
        <p>{state.error}</p>
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
    <section className="synopsis-content">
      <div className="synopsis-wrapper">
        <div className="synopsis-body">
          <div className="content-text-wrapper">
            <div className="title-group">
              <span className="synopsis-author">
                {state.novelInfo.author}
              </span>
              <span className="synopsis-jp-title">
                信長の嫁、はじめました ～ポンコツ魔女の戦国内政日記～
              </span>
              <a 
                href="https://kakuyomu.jp/works/16817330650819696457" 
                className="synopsis-title"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {state.novelInfo.title}
              </a>
            </div>

            <div className="synopsis-text">
              {synopsisDetails.map((paragraph, index) => (
                <p key={`para-${index}`}>{paragraph}</p>
              ))}
              
              <p><strong>Example:</strong></p>
              <ul>
                {nameExamples.map((item, index) => (
                  <li key={`name-${index}`}>{item}</li>
                ))}
              </ul>
              
              <p>Also, if there is a widely known image, I will use that.</p>
              
              <p><strong>Example:</strong></p>
              <ul>
                {visualExamples.map((item, index) => (
                  <li key={`visual-${index}`}>{item}</li>
                ))}
              </ul>
              
              <p>This work is also published in Shōsetsuka ni Narō and AlphaPolis.</p>
            </div>

            <div className="volumes-container">
              {state.volumes.length > 0 ? (
                state.volumes.map((volume) => (
                  <VolumeDropdown 
                    key={`vol-${volume.number}`}
                    title={`VOLUME ${volume.number}${volume.title ? ` - ${volume.title.toUpperCase()}` : ''}`}
                  >
                    {volume.chapters?.length > 0 ? (
                      volume.chapters.map((chapter) => (
                        <div key={`ch-${chapter.number}`} className="chapter-link">
                          <Link 
                            to={`/novel/${state.novelInfo.id}/chapter/${chapter.number}`}
                            className="chapter-link-text"
                          >
                            Chapter {chapter.number}: {chapter.title || `Chapter ${chapter.number}`}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="no-chapters">No chapters available</p>
                    )}
                  </VolumeDropdown>
                ))
              ) : (
                <p className="no-volumes">No volumes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterSyn />
    </section>
  );
}

export default PonkotsuSyn;
