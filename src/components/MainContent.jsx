import React from 'react';
import './MainContent.css';
import chibiImage from '../assets/helena_gilgamesh.png';
import { Link } from 'react-router-dom';

function MainContent() {
  const storyDetails = [
    "The clumsy witch falls in love at first sight with Oda Nobunaga!",
    "I leave the battles to my husband (Nobunaga) and work hard on domestic affairs cheats!",
    "I reincarnated into another world for various reasons. Since I mastered magic, I decided to return to modern Japan.",
    "...Well, I made a little mistake and ended up in the Sengoku period.",
    "Huh? I've become Kicho? The one who becomes Nobunaga's wife? It's a mistake... How did this happen?",
    "Well, if I avoid the Incident at Honnō-ji, I'll be the wife of the ruler, so until then, while using domestic and military cheats, I'll lead a slow life—uh, husband? Could you stop trying to bring us into the spotlight of history?"
  ];

  const statusInfo = [
    { label: "Story status", value: "Ongoing" },
    { label: "Translation status", value: "Ongoing" }
  ];

  return (
    <section className="main-content">
      <div className="content-wrapper">
        <div className="content-body">
          <img src={chibiImage} alt="Chibi Helena" className="content-img" />
          <div className="content-text-wrapper">
            <Link to="/synopsis" className="content-title">
              I Become Oda Nobunaga's Wife: Diary of a Ponkotsu Witch's Domestic Affairs in the Warring States Period
            </Link>
            <div className="content-text">
              {storyDetails.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {statusInfo.map(({ label, value }, index) => (
                <p key={`status-${index}`}>
                  <strong>{label}:</strong> {value}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainContent;
