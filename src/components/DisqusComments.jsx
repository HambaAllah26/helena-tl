import React, { useEffect } from 'react';

const DisqusComments = ({ novelId, chapterNumber, chapterTitle }) => {
  useEffect(() => {
    const initDisqus = () => {
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = `${novelId}-ch${chapterNumber}`;
            this.page.url = `${window.location.origin}/novel/${novelId}/chapter/${chapterNumber}`;
            this.page.title = `${chapterTitle} | ${novelId}`;
          }
        });
      } else {
        const script = document.createElement('script');
        script.src = 'https://helenatl.disqus.com/embed.js';
        script.setAttribute('data-timestamp', +new Date());
        script.async = true;
        script.setAttribute('data-timestamp', Date.now());
        
        const disqusConfig = `
          var disqus_config = function () {
            this.page.url = '${window.location.origin}/novel/${novelId}/chapter/${chapterNumber}';
            this.page.identifier = '${novelId}-ch${chapterNumber}';
            this.page.title = '${chapterTitle} | ${novelId}';
          };
        `;
        
        const configScript = document.createElement('script');
        configScript.innerHTML = disqusConfig;
        
        document.body.appendChild(configScript);
        document.body.appendChild(script);
      }
    };

    initDisqus();

    return () => {
    };
  }, [novelId, chapterNumber, chapterTitle]);

  return (
    <div className="disqus-container" style={{ marginTop: '40px', padding: '20px', background: '#1f2937' }}>
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the 
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  );
};

export default DisqusComments;
