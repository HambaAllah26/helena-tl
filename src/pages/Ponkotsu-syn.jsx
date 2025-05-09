import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novelId, setNovelId] = useState('');

  useEffect(() => {
    const loadNovelData = async () => {
      try {
        const response = await import('../data/json/meta-ponkotsu.json');
        if (!response.default?.volumes || !response.default?.novelId) {
          throw new Error('Invalid novel data structure');
        }
        setVolumes(response.default.volumes);
        setNovelId(response.default.novelId);
      } catch (error) {
        console.error('Error loading novel data:', error);
        setError('Failed to load novel data');
      } finally {
        setLoading(false);
      }
    };

    loadNovelData();
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

if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="synopsis-content">
      <div className="synopsis-wrapper">
        <div className="synopsis-body">
          <div className="content-text-wrapper">
            <div className="title-group">
              <span className="synopsis-author">
                Hazuki Kujou - 九條葉月
              </span>
              <span className="synopsis-jp-title">
                信長の嫁、はじめました ～ポンコツ魔女の戦国内政日記～
              </span>
              <a href="https://kakuyomu.jp/works/16817330650819696457" className="synopsis-title">
                I Become Oda Nobunaga's Wife: Diary of a Ponkotsu Witch's Domestic Affairs in the Warring States Period
              </a>
            </div>
            <div className="synopsis-text">
              {synopsisDetails.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p><strong>Example:</strong></p>
              <ul>
                {nameExamples.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>Also, if there is a widely known image, I will use that.</p>
              <p><strong>Example:</strong></p>
              <ul>
                {visualExamples.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>This work is also published in Shōsetsuka ni Narō and AlphaPolis.</p>
            </div>

           {volumes.map((volume) => (
              <VolumeDropdown 
                key={`vol-${volume.number}`} 
                title={`VOLUME ${volume.number}${volume.title ? ` - ${volume.title.toUpperCase()}` : ''}`}
              >
                {volume.chapters?.map((chapter) => (
                  <div key={`ch-${chapter.number}`} className="chapter-link">
                    <Link 
                      to={`/novel/${novelId}/chapter/${chapter.number}`}
                      className="chapter-link-text"
                    >
                      Chapter {chapter.number}: {chapter.title || `Chapter ${chapter.number}`}
                    </Link>
                  </div>
                )) || <p>No chapters available</p>}
              </VolumeDropdown>
            ))}
          </div>
        </div>
      </div>
      <FooterSyn />
    </section>
  );
}

export default PonkotsuSyn;
