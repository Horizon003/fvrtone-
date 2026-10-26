import { useEffect, useRef, useState } from "react";
import { Gamepad2, Heart, LockKeyhole, Music2, Sparkles, Star, VolumeX } from "lucide-react";

const PASSCODE = "150906";
const PANDA_IMAGE = "/panda-cutout.webp";

const loveReasons = ["your company", "your caring heart", "your cute gussa", "the way you samjhti ho", "every secret smile", "more than 999999999 reasons"];
const memoryCards = ["♡", "♡", "✦", "✦", "∞", "∞"];
const hundredReasons = [
  "Tumhara mere saath rehna", "Tumhara mujhay dekhna", "Tumhara mujhse baat karna", "Tumhara hamesha care karna", "Tumhara mujhay dekh kar hasna",
  "Tumhara mere liye pareshan hona", "Tumhara meri choti choti baatein yaad rakhna", "Tumhara bina kahe samajh jana", "Tumhara mera mood theek karna", "Tumhara meri khamoshi sun lena",
  "Tumhara mera gussa seh lena", "Tumhara khud gussa ho kar bhi fikr karna", "Tumhari cute si smile", "Tumhari pyari si awaaz", "Tumhara mujhay special feel karwana",
  "Tumhara meri side lena", "Tumhara mujhay motivate karna", "Tumhara meri mistakes maaf kar dena", "Tumhara mujhay behtar banne ko kehna", "Tumhara mere dreams par yaqeen karna",
  "Tumhara meri random baatein sunna", "Tumhara meri bak bak enjoy karna", "Tumhara mujhay tease karna", "Tumhara phir khud sharma jana", "Tumhara mujhay apna samajhna",
  "Tumhari woh secret si smile", "Tumhara mujhay miss karna", "Tumhara meri absence notice karna", "Tumhara mera naam pyar se lena", "Tumhara har baat mein apnapan",
  "Tumhara mera khayal rakhna", "Tumhara mujhay khana yaad dilana", "Tumhara mere rest ki fikr karna", "Tumhara meri health poochna", "Tumhara meri tension samajhna",
  "Tumhara mushkil din mein saath dena", "Tumhara meri jeet par khush hona", "Tumhara meri haar mein haath pakarna", "Tumhara mujhay kabhi akela na feel hone dena", "Tumhara meri safe place hona",
  "Tumhara meri best friend hona", "Tumhara meri favourite company hona", "Tumhara mere secrets sambhalna", "Tumhara meri silly jokes par hasna", "Tumhara meri ajeeb aadatein accept karna",
  "Tumhara mujhay judge na karna", "Tumhara sach bolna", "Tumhara meri feelings ki respect karna", "Tumhara meri boundaries samajhna", "Tumhara mujhay space de kar bhi paas rehna",
  "Tumhara wapas aa jana", "Tumhara laraai ke baad baat karna", "Tumhara sorry bol dena", "Tumhara mujhay sorry kehne ka mauqa dena", "Tumhara har fight ke baad aur close ho jana",
  "Tumhara cute sa gussa", "Tumhara gusse mein bhi care karna", "Tumhara naraz ho kar bhi online rehna", "Tumhara meri awaaz se mood samajhna", "Tumhara mere naam par smile karna",
  "Tumhari kindness", "Tumhara soft dil", "Tumhara strong hona", "Tumhara apne dreams ke liye ladna", "Tumhara apni family se pyaar karna",
  "Tumhara doston ka khayal rakhna", "Tumhara choti cheezon mein khushi dhoondna", "Tumhara mujhay gratitude sikhana", "Tumhara meri duniya bright karna", "Tumhara meri boring life ko cute banana",
  "Tumhara mujhay hasana", "Tumhara mujhay chup karwana", "Tumhara mujhay surprise karna", "Tumhara meri expectations se zyada sweet hona", "Tumhara bina reason message karna",
  "Tumhara good morning kehna", "Tumhara good night kehna", "Tumhara meri routine ka hissa hona", "Tumhara meri favourite notification hona", "Tumhara meri screen par naam ban kar aana",
  "Tumhara mujhay apna Panda kehna", "Tumhara mujhay Ice bear samajhna", "Tumhari meri silly nicknames", "Tumhara cute kuchu puchu hona", "Tumhara meri Queen hona",
  "Tumhara meri baat maan lena", "Tumhara mujhay apni baat manwana", "Tumhara mujhay challenge karna", "Tumhara mujhse compete karna", "Tumhara phir jeet kar khush hona",
  "Tumhara mera haath na chhorna", "Tumhara hum par yaqeen rakhna", "Tumhara do saal baad bhi saath hona", "Tumhara har season mein mere saath hona", "Tumhara meri favourite memory hona",
  "Tumhara future mein bhi mere saath nazar aana", "Tumhara meri duaon ka hissa hona", "Tumhara meri life ka sukoon hona", "Tumhara meri duniya ka sabse pyara insan hona", "Tumhara bas tum hona",
];

export default function Home() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("panda-card-unlocked") === "yes");
  const [passcode, setPasscode] = useState("");
  const [wrongCode, setWrongCode] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [heartSpot, setHeartSpot] = useState({ top: 46, left: 50 });
  const [reasonIndex, setReasonIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [memory, setMemory] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [reasonGameIndex, setReasonGameIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (memory.length === 2) {
      if (memoryCards[memory[0]] === memoryCards[memory[1]]) {
        setMatched((current) => {
          const next = [...current, ...memory];
          if (next.length === memoryCards.length) celebrate();
          return next;
        });
      }
      const timeout = window.setTimeout(() => setMemory([]), 520);
      return () => window.clearTimeout(timeout);
    }
  }, [memory]);

  useEffect(() => {
    if (!unlocked) return;
    const startOnFirstTouch = (event: Event) => {
      if ((event.target as Element | null)?.closest?.(".music-toggle")) return;
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.volume = 0.25;
      audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    };
    window.addEventListener("pointerdown", startOnFirstTouch, { once: true, passive: true });
    return () => window.removeEventListener("pointerdown", startOnFirstTouch);
  }, [unlocked]);

  const unlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode === PASSCODE) {
      sessionStorage.setItem("panda-card-unlocked", "yes");
      setUnlocked(true);
      setWrongCode(false);
    } else {
      setWrongCode(true);
      setPasscode("");
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        audio.volume = 0.25;
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    } else {
      audio.pause();
      setMusicOn(false);
    }
  };

  const chooseMemory = (index: number) => {
    if (memory.length === 2 || memory.includes(index) || matched.includes(index)) return;
    setMemory((current) => [...current, index]);
  };

  const catchHeart = () => {
    setHeartCount((count) => count + 1);
    setHeartSpot({ top: 22 + Math.round(Math.random() * 56), left: 16 + Math.round(Math.random() * 68) });
    if (heartCount + 1 === 5) celebrate();
  };

  const celebrate = () => {
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 2600);
  };

  const answerQuiz = (answer: string) => {
    setQuizAnswer(answer);
    celebrate();
  };

  const nextReason = () => {
    if (reasonGameIndex === hundredReasons.length - 1) {
      celebrate();
      return;
    }
    setReasonGameIndex((index) => index + 1);
  };

  if (!unlocked) {
    return (
      <main className="lock-page">
        <div className="grain" aria-hidden="true" />
        <div className="lock-card">
          <div className="lock-heart"><Heart size={30} fill="currentColor" /></div>
          <div className="section-kicker"><Sparkles size={14} /> private little card</div>
          <h1>For my<br /><em>favourite</em> person.</h1>
          <p>Yeh card sirf Meri Pyari Faiqa ke liye hai. Apna secret code dial karo aur andar aa jao.</p>
          <form onSubmit={unlock} className="passcode-form">
            <label htmlFor="passcode"><LockKeyhole size={14} /> secret passcode</label>
            <input id="passcode" inputMode="numeric" autoComplete="off" maxLength={6} value={passcode} onChange={(event) => setPasscode(event.target.value.replace(/\D/g, ""))} placeholder="• • • • • •" aria-describedby="code-help" />
            <button type="submit">open my heart <Heart size={16} fill="currentColor" /></button>
            <span id="code-help" className={`code-hint${wrongCode ? " wrong" : ""}`} aria-live="polite">{wrongCode ? "hmm… yeh code Faiqa wala nahi hai ♡" : "six digits, just for you"}</span>
          </form>
          <div className="lock-signoff">from your <strong>Panda</strong> ♡</div>
        </div>
      </main>
    );
  }

  return (
    <main className="card-page">
      <div className="grain" aria-hidden="true" />
      <audio ref={audioRef} src="/romantic-bg.mp3" loop preload="metadata" />
      {celebrating && <div className="celebration-rain" aria-live="polite" aria-label="Game completed"><span>♡</span><span>✦</span><span>YAY!</span><span>♡</span><span>Faiqa!</span><span>✦</span><span>♡</span><span>LOVE</span></div>}
      <header className="card-topbar">
        <div className="mini-brand"><span className="brand-mark"><Heart size={15} fill="currentColor" /></span> private card no. 02</div>
        <button className={`music-toggle${musicOn ? " is-playing" : ""}`} type="button" onClick={toggleMusic} aria-pressed={musicOn}>{musicOn ? <VolumeX size={14} /> : <Music2 size={14} />} {musicOn ? "pause our song" : "play our song"}</button>
      </header>

      <section className="card-hero" aria-labelledby="love-title">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> two years & still us</div>
          <h1 id="love-title">Meri Pyari<br /><em>Faiqa.</em></h1>
          <p className="hero-message">Do saal hogaiy humain Pharm-D kartay hoiy — lartay, jaghrtay, hanstay, phir bhi saath. Jab mujhay koi nahi samjhta, <strong>you samjhti ho mujhay.</strong></p>
          <p className="hero-message">Aur jab you gussa hoti ho, mujhay woh bhi pyara lagta hai… kyunkay us gussay mein bhi mera khayal hota hai. That's why I love you — more than <strong>999999999 reasons.</strong></p>
          <div className="hero-stamp"><span>Jeeeee</span> teeeee rho<br /><strong>meri Queen</strong></div>
        </div>
        <div className="panda-stage" aria-label="Animated cutout of Panda">
          <div className="halo" aria-hidden="true" />
          <div className="spark spark-a">✦</div><div className="spark spark-b">♡</div><div className="spark spark-c">✦</div>
          <img className="panda-cutout" src={PANDA_IMAGE} alt="Meri Pyari Faiqa, smiling with her hands near her heart" />
          <div className="stage-caption">my cute bacha<br /><strong>mera cute kuchu puchu</strong></div>
        </div>
      </section>

      <section className="message-card">
        <div className="message-card-tape" aria-hidden="true" />
        <div className="section-kicker">a note from my heart</div>
        <h2>When the world<br /><em>doesn't understand…</em></h2>
        <p>you do. That's my favourite thing about you. Tum meri dost ho, meri safe place ho, meri favourite company ho. Gussa bhi utna, pyaar bhi utna — aur tumhare baghair rehna? Bilkul nahi.</p>
        <div className="reason-row"><span>reason #{reasonIndex + 1}</span><strong>{loveReasons[reasonIndex]}</strong><button type="button" onClick={() => setReasonIndex((reasonIndex + 1) % loveReasons.length)} aria-label="Show another reason">another ♡</button></div>
      </section>

      <section className="games-section" aria-labelledby="games-title">
        <div className="section-kicker"><Gamepad2 size={15} /> our little arcade</div>
        <h2 id="games-title">Play a little,<br /><em>Faiqa.</em></h2>
        <p className="section-intro">Chaar choti games — kyunkay Meri Pyari Faiqa ko smile karwana meri favourite game hai.</p>
        <div className="games-grid">
          <article className="game-card game-heart">
            <div className="game-number">01</div><h3>Catch Faiqa's hearts</h3><p>Heart ko pakro — woh tum se sharma kar bhaag raha hai.</p>
            <div className="heart-arena"><span className="arena-note">catch me ♡</span><button className="moving-heart" style={{ top: `${heartSpot.top}%`, left: `${heartSpot.left}%` }} type="button" onClick={catchHeart} aria-label="Catch a moving heart"><Heart size={26} fill="currentColor" /></button></div>
            <strong className="score">{heartCount === 0 ? "tap the moving heart" : `${heartCount} heart${heartCount === 1 ? "" : "s"} caught for Faiqa`}</strong>
          </article>
          <article className="game-card game-memory">
            <div className="game-number">02</div><h3>Find our pairs</h3><p>Do saal ki yaadon ke matching signs dhoondo.</p>
            <div className="memory-grid">{memoryCards.map((card, index) => <button key={index} type="button" className={`memory-tile${memory.includes(index) || matched.includes(index) ? " flipped" : ""}`} onClick={() => chooseMemory(index)} aria-label={`Memory card ${index + 1}`}>{memory.includes(index) || matched.includes(index) ? card : "?"}</button>)}</div>
          </article>
          <article className="game-card game-quiz">
            <div className="game-number">03</div><h3>Faiqa quiz</h3><p>Who is the cutest girl in my world?</p>
            <div className="quiz-options">{["Meri Pyari Faiqa", "meri Queen", "dono ♡"].map((answer) => <button key={answer} type="button" className={quizAnswer === answer ? "selected" : ""} onClick={() => answerQuiz(answer)}>{answer}</button>)}</div>
            {quizAnswer && <div className="quiz-result">{quizAnswer === "dono ♡" ? "correct — tum hi meri dono ho ♡" : "almost… tum hi meri sab kuch ho ♡"}</div>}
          </article>
          <article className="game-card game-reasons">
            <div className="game-number">04</div><h3>100 reasons</h3><p>100 reasons kyun main Faiqa ko love karta hoon.</p><div className="reason-game"><span className="reason-counter">reason {reasonGameIndex + 1} / 100</span><strong>{hundredReasons[reasonGameIndex]}</strong><button type="button" onClick={nextReason}>{reasonGameIndex === 99 ? "finish with graffiti ♡" : "next reason →"}</button></div>
          </article>
        </div>
      </section>

      <footer className="card-footer">
        <div className="footer-line" aria-hidden="true"><span /><Heart size={16} fill="currentColor" /><span /></div>
        <p>from your <strong>Panda</strong> to my <strong>Ice bear</strong> ♡</p>
        <small>Jeeeee teeeee rho meri Queen</small>
      </footer>
    </main>
  );
}
