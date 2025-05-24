import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import bgMusic from './assets/HBD Music.mp3';
import photo from './assets/Deepika Photo.jpg'

export default function App() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days:'--', hours:'--', minutes:'--', seconds:'--' });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const audioRef = useRef(null);
  const confettiRef = useRef(null);
  const balloonsRef = useRef(null);
  const sparklesRef = useRef(null);

  // Countdown update
  useEffect(() => {
    const target = new Date('2025-05-25T00:00:00'); //change to 25
    const timerId = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if(diff <= 0) {
        clearInterval(timerId);
        setTimeLeft({ days:'00', hours:'00', minutes:'00', seconds:'00' });
        setCountdownOver(true); //mark countdown is over
        return;
      }
      setTimeLeft({
        days: String(Math.floor(diff / (1000*60*60*24))).padStart(2,'0'),
        hours: String(Math.floor((diff / (1000*60*60)) % 24)).padStart(2,'0'),
        minutes: String(Math.floor((diff / (1000*60)) % 60)).padStart(2,'0'),
        seconds: String(Math.floor((diff / 1000)%60)).padStart(2,'0'),
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [started]);

  const launchConfetti = () => {
    if(!confettiRef.current) return;
    const colors = ['#FF9AD3','#FFA1A1','#FFB2E9', '#FDB9DB', '#FF6D91'];
    const container = confettiRef.current;
    container.innerHTML = '';
    for(let i=0; i<120; i++){
      const div = document.createElement('div');
      div.className = 'confetti-piece';
      div.style.backgroundColor = colors[i % colors.length];
      div.style.left = Math.random()*100 + 'vw';
      div.style.animationDuration = (3 + Math.random()*2) + 's';
      div.style.animationDelay = Math.random()*0.7 + 's';
      container.appendChild(div);
      div.addEventListener('animationend', () => div.remove());
    }
  };

  const createBalloon = (color, left, delay) => {
    if(!balloonsRef.current) return;
    const balloon = document.createElement('div');
    balloon.className = 'balloon balloon-animate';
    balloon.style.backgroundColor = color;
    balloon.style.left = left + 'vw';
    balloon.style.animationDelay = delay + 's';
    balloonsRef.current.appendChild(balloon);
    balloon.addEventListener('animationend', () => balloon.remove());
  }

  const launchBalloons = () => {
    const colors = ['#FF6D91', '#FFD3E0', '#FF8ABF', '#FFB6C1', '#FFC0CB'];
    for(let i=0; i<30; i++){
      createBalloon(
        colors[i % colors.length],
        5 + Math.random()*90,
        Math.random()*4
      );
    }
  };

  const createSparkle = (left, top, size, delay) => {
    if(!sparklesRef.current) return;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle sparkle-animate';
    sparkle.style.left = left + 'vw';
    sparkle.style.top = top + 'vh';
    sparkle.style.width = sparkle.style.height = size + 'px';
    sparkle.style.animationDelay = delay + 's';
    sparklesRef.current.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove());
  }

  const launchSparkles = () => {
    for(let i=0; i<40; i++){
      createSparkle(
        Math.random()*100,
        Math.random()*100,
        4 + Math.random()*4,
        Math.random()*7
      );
    }
  }

  const start = () => {
    setStarted(true);
    launchConfetti();
    launchBalloons();
    launchSparkles();
    if(audioRef.current){
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(err => console.warn('Audio play failed:',err));
      setMusicPlaying(true);
    }
    setTimeout(() => setShowAbout(true), 5000);
  };

  const toggleMusic = () => {
    if(!audioRef.current) return;
    if(musicPlaying){
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play();
      setMusicPlaying(true);
    }
  };

    const [countdownOver, setCountdownOver] = useState(false);

  return <>
    {/* Fixed countdown top */}
    <div className="countdown-top" aria-live="polite" aria-atomic="true" tabIndex={0}>
      <div className="countdown-label">Countdown to Deepika's 11th Birthday</div>
      <div className="countdown-timer">
        <span>{timeLeft.days}d</span> : <span>{timeLeft.hours}h</span> : <span>{timeLeft.minutes}m</span> : <span>{timeLeft.seconds}s</span>
      </div>
      {started && <button
        aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
        onClick={toggleMusic}
        className="music-toggle"
        aria-pressed={musicPlaying}
      >
        {musicPlaying ? '🔈 Pause Music' : '🔇 Play Music'}
      </button>}
    </div>
    <div className="app-container enhanced-bg">
      <div ref={confettiRef} className="confetti-wrapper" aria-hidden="true" />
      <div ref={balloonsRef} className="balloons-wrapper" aria-hidden="true" />
      <div ref={sparklesRef} className="sparkles-wrapper" aria-hidden="true" />

      {!started ? (
        <button className="magic-button" onClick={start} aria-label="Start the birthday surprise" disabled={!countdownOver} style={{ opacity: countdownOver ? 1 : 0.5, cursor: countdownOver ? 'pointer' : 'not-allowed' }}>
          🎁
        </button>
      ) : (
        <>
          <CakeAnimation side="left" />
          <CakeAnimation side="right" />

          <h1 className="main-title glow-text" tabIndex={0}>
            🎉 Happy 11th Birthday Deepu!! 🎉
          </h1>

          {showAbout && <AboutSneha />}
        </>
      )}
      {!countdownOver && (
        <p style={{ marginTop: '12px', fontSize: '1rem' , paddingTop: 30}}>
          ⏳ The gift unlocks when the countdown reaches zero!
        </p>
)}

    </div>

    <audio ref={audioRef} loop preload="auto">
      <source src={bgMusic} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </>
}

function CakeAnimation({side}) {
  return (
    <div className={`cake-container cake-${side}`} aria-hidden="true" >
      <div className="cake-base">
        <div>

        </div>
      </div>
      <CandleFire />
    </div>
  )
}

function CandleFire() {
  return (
    <div className="candle-flame" aria-hidden="true" >
      <div className="flame-core" />
      <div className="flame-glow" />
    </div>
  )
}

function ComplimentsList() {
  return (
    <section className="compliments-list" aria-live="polite" tabIndex={0}>
      {[
        'Happy 11th birthday, kiddo',
        'You’re smart, funny, and way cooler than I was at your age (don’t let it go to your head 😄). I’m really proud of you and lucky to have you as my sister. Hope your day’s full of cake, laughs, and all the stuff you love.',
        'Have the best birthday ever! 🎉',
        '—Your annoying but awesome big bro',
      ].map((line, i) => (
        <p
          key={i}
          className="glow-text fade-in"
          style={{ animationDelay: 1 + i * 0.3 + 's' }}
        >
          {line}
        </p>
      ))}
    </section>
  );
}

function AboutSneha() {
  return (
    <div
  className="about-sneha-container"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 'px',
    justifyContent: 'center',
    marginTop: '20px',
    flexWrap: 'wrap',
    marginLeft: '200px',  // <--- add this to shift right
  }}
>
      <ComplimentsList />
      <img class=".about-sneha"
        src={photo}
        alt="Deepika"
        style={{ width: '200px', height: 'auto', borderRadius: '10px' }}
      />
    </div>
  );
}
