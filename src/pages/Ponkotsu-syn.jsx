import React from 'react';
import './Ponkotsu-syn.css'; // You'll define similar styles as MainContent.css
import bannerImage from '../assets/banner.jpg'; // Replace with actual path

function SynopsisPage() {
  const synopsisDetails = [
    "※ It won the “Finalist” award at the 5th Earth Star Novel Grand Prize and has been decided to be published!",
    "The clumsy witch falls in love at first sight with Oda Nobunaga.",
    "I leave the battles to my husband (Nobunaga) and work hard on domestic affairs cheats!",
    "I reincarnated into another world for various reasons. Since I mastered magic, I decided to return to modern Japan.",
    "...Well, I made a little mistake and ended up in the Sengoku period.",
    "Huh!? I’ve become Kichi? The one who becomes Nobunaga’s wife!? It’s a mistake... How did this happen?",
    "Well, if I avoid the incident at Honno-ji, I’ll be the wife of the ruler, so until then, while using domestic and military cheats, I’ll lead a slow life—uh, husband? Could you stop trying to bring us into the spotlight of history?",
    "* Since getting too detailed can be confusing, I will use widely known names in this work."
  ];

  const nameExamples = [
    "Saito Toshimasa → Saito Dosan",
    "Sanada Nobushige → Sanada Yukimura",
    "Akechi Koreto Hyuga no Kami → Akechi Mitsuhide",
    "Kazusa no Suke-sama → Nobunaga-sama"
  ];

  const visualExamples = [
    "Takeda Shingen’s shaved head, Maeda Keiji, and so on."
  ];

  return (
    <section className="main-content">
      <div className="content-wrapper">
        <div className="content-body">
          <img src={bannerImage} alt="Banner" className="content-img" />
          <div className="content-text-wrapper">
            <a href="#" className="content-title">
              I Become Oda Nobunaga's Wife: Diary of a Ponkotsu Witch's Domestic Affairs in the Warring States Period
            </a>
            <div className="content-text">
              {synopsisDetails.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p><strong>Example (Names):</strong></p>
              <ul>
                {nameExamples.map((item, index) => (
                  <li key={`name-${index}`}>{item}</li>
                ))}
              </ul>
              <p><strong>Example (Images):</strong></p>
              <ul>
                {visualExamples.map((item, index) => (
                  <li key={`img-${index}`}>{item}</li>
                ))}
              </ul>
              <p>This work is also published in Shōsetsuka ni Narō and AlphaPolis.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SynopsisPage;

