import React from 'react';
import './MainContent.css';
import chibiImage from '../assets/helena_gilgamesh.png'; // Add this image to your assets

function MainContent() {
  return (
    <section className="main-content">
      <div className="content-wrapper">
        <a
          href="#"
          className="content-title"
        >
          I Become Oda Nobunaga’s Wife: Diary of a Ponkotsu Witch’s Domestic Affairs in the Warring States Period
        </a>
        <div className="content-body">
          <img src={chibiImage} alt="Chibi Helena" className="content-img" />
          <div className="content-text">
            <p>The clumsy witch falls in love at first sight with Oda Nobunaga!</p>
            <p>I leave the battles to my husband (Nobunaga) and work hard on domestic affairs cheats!</p>
            <p>I reincarnated into another world for various reasons. Since I mastered magic, I decided to return to modern Japan.</p>
            <p>...Well, I made a little mistake and ended up in the Sengoku period.</p>
            <p>Huh? I've become Kicho? The one who becomes Nobunaga's wife? It's a mistake... How did this happen?</p>
            <p>
              Well, if I avoid the Incident at Honnō-ji, I'll be the wife of the ruler, so until then, while using domestic and military cheats,
              I'll lead a slow life—uh, husband? Could you stop trying to bring us into the spotlight of history?
            </p>
            <p><strong>Story status:</strong> Ongoing</p>
            <p><strong>Translation status:</strong> Ongoing</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainContent;

