import { useState, useEffect } from 'react';
import axios from 'axios';
import * as wanakana from 'wanakana';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaLayerGroup, FaGraduationCap, FaClock, 
  FaCheck, FaArrowRight, FaArrowLeft, FaRedo, 
  FaRandom, FaKeyboard 
} from 'react-icons/fa';
import './App.css';

const API_URL = "http://localhost:8080/api/cards";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        {/* AnimatePresence giúp tạo hiệu ứng khi chuyển trang */}
        <AnimatePresence mode="wait">
          <RoutesWrapper />
        </AnimatePresence>
      </div>
    </Router>
  );
}

// Wrapper để lấy location cho AnimatePresence
function RoutesWrapper() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageWrapper><AddPage /></PageWrapper>} />
      <Route path="/library" element={<PageWrapper><LibraryPage /></PageWrapper>} />
      <Route path="/study" element={<PageWrapper><StudyPage /></PageWrapper>} />
      <Route path="/test" element={<PageWrapper><TestPage /></PageWrapper>} />
    </Routes>
  );
}

// Component bọc hiệu ứng chuyển động cho từng trang
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.98 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="glass-panel"
  >
    {children}
  </motion.div>
);

// --- NAVBAR "GIỌT NƯỚC" (LIQUID) ---
function Navbar() {
  const location = useLocation();
  const tabs = [
    { path: '/', label: 'Thêm thẻ', icon: <FaPlus /> },
    { path: '/library', label: 'Kho thẻ', icon: <FaLayerGroup /> },
    { path: '/study', label: 'Ôn tập', icon: <FaGraduationCap /> },
    { path: '/test', label: 'Kiểm tra', icon: <FaClock /> },
  ];

  return (
    <div className="nav-container">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none', position: 'relative' }}>
            <button className={`nav-item ${isActive ? 'selected' : ''}`}>
              {/* Viên thuốc trắng trượt qua lại */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="active-pill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {/* Nội dung nút */}
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {tab.icon} {tab.label}
              </span>
            </button>
          </Link>
        );
      })}
    </div>
  );
}

// --- 1. NHẬP LIỆU ---
function AddPage() {
  const [jp, setJp] = useState('');
  const [meaning, setMeaning] = useState('');
  const [status, setStatus] = useState(null);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const handleInputJp = (e) => {
    const val = e.target.value;
    isAutoMode ? setJp(wanakana.toKana(val)) : setJp(val);
  };

  const addCard = async () => {
    if (!jp || !meaning) return;
    try {
      await axios.post(API_URL, { japanese: jp, meaning: meaning, example: "Từ vựng" });
      setStatus('Đã lưu thành công!'); setJp(''); setMeaning('');
      setTimeout(() => setStatus(null), 2000);
    } catch { setStatus('Lỗi kết nối!'); }
  };

  return (
    <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '30px'}}>Thêm từ vựng mới</h2>
      
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30, gap: 15}}>
        <button className="btn" style={{background: isAutoMode ? 'var(--primary)' : 'rgba(255,255,255,0.5)', color: isAutoMode ? '#fff' : '#000'}} onClick={() => setIsAutoMode(true)}>
          Auto Hiragana
        </button>
        <button className="btn" style={{background: !isAutoMode ? 'var(--primary)' : 'rgba(255,255,255,0.5)', color: !isAutoMode ? '#fff' : '#000'}} onClick={() => setIsAutoMode(false)}>
          <FaKeyboard /> Kanji
        </button>
      </div>

      <input className="input-glass jp-font" value={jp} onChange={handleInputJp} placeholder={isAutoMode ? "romaji (vd: neko)" : "Nhập Kanji..."} />
      <input className="input-glass" value={meaning} onChange={e => setMeaning(e.target.value)} placeholder="Nghĩa tiếng Việt" />
      
      <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={addCard}>Lưu vào kho</button>
      {status && <p style={{marginTop: 20, fontSize: '1.2rem', fontWeight: 'bold', color: '#059669'}}>{status}</p>}
    </div>
  );
}

// --- 2. KHO THẺ ---
function LibraryPage() {
  const [cards, setCards] = useState([]);
  useEffect(() => { axios.get(API_URL).then(res => setCards(res.data.reverse())); }, []);

  return (
    <div>
      <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px'}}>Kho từ vựng ({cards.length})</h2>
      <div className="grid-container">
        {cards.map(c => (
          <div key={c.id} className="mini-card">
            <h3 className="jp-font" style={{margin: '0 0 10px 0', fontSize: '2rem', color: 'var(--primary)'}}>{c.japanese}</h3>
            <p style={{margin: 0, fontSize: '1.2rem', color: '#4b5563'}}>{c.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. ÔN TẬP (THẺ KÍNH 2 CHIỀU) ---
function StudyPage() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('learned_cards')) || [];
    setLearnedIds(saved);
    axios.get(API_URL).then(res => setCards(res.data.filter(c => !saved.includes(c.id))));
  }, []);

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled); setIndex(0); setFlipped(false);
  };

  const nextCard = () => { setFlipped(false); setTimeout(() => setIndex((prev) => (prev + 1) % cards.length), 400); };
  const prevCard = () => { setFlipped(false); setTimeout(() => setIndex((prev) => (prev - 1 + cards.length) % cards.length), 400); };

  const markLearned = () => {
    const card = cards[index];
    const newLearned = [...learnedIds, card.id];
    setLearnedIds(newLearned);
    localStorage.setItem('learned_cards', JSON.stringify(newLearned));
    const remaining = cards.filter(c => c.id !== card.id);
    setCards(remaining); setIndex(0); setFlipped(false);
  };

  const resetProgress = () => { localStorage.removeItem('learned_cards'); window.location.reload(); };

  if (cards.length === 0) return (
    <div style={{textAlign: 'center', padding: '60px'}}>
      <h2 style={{fontSize: '3rem'}}>🎉 Xuất sắc!</h2>
      <p style={{fontSize: '1.5rem'}}>Bạn đã thuộc hết từ vựng.</p>
      <button className="btn btn-primary" onClick={resetProgress} style={{marginTop: 30}}><FaRedo/> Học lại</button>
    </div>
  );

  const current = cards[index];

  return (
    <div className="study-container">
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', alignItems: 'center'}}>
        <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#555'}}>Thẻ {index + 1} / {cards.length}</span>
        <div style={{display: 'flex', gap: 15}}>
          <button onClick={shuffleCards} className="btn" style={{background: 'rgba(255,255,255,0.6)'}}><FaRandom /> Trộn</button>
          <button onClick={markLearned} className="btn" style={{background: '#10B981', color: 'white'}}><FaCheck /> Đã thuộc</button>
        </div>
      </div>

      <div className="card-area" onClick={() => setFlipped(!flipped)}>
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          {/* MẶT TRƯỚC (Kính trong) */}
          <div className="card-face front">
            <h1 className="jp-font jp-large">{current.japanese}</h1>
            <p style={{marginTop: 30, opacity: 0.6, fontSize: '1.2rem'}}>(Chạm để lật)</p>
          </div>
          {/* MẶT SAU (Kính mờ đục hơn) */}
          <div className="card-face back">
            <h2 className="jp-font vi-large">{current.meaning}</h2>
            <div style={{marginTop: 20, background: 'rgba(255,255,255,0.5)', padding: '15px 30px', borderRadius: '15px', fontSize: '1.2rem'}}>
              {current.example || "..."}
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: 40, marginTop: 20}}>
        <button className="nav-btn" onClick={prevCard}><FaArrowLeft /></button>
        <button className="nav-btn" onClick={nextCard}><FaArrowRight /></button>
      </div>
    </div>
  );
}

// --- 4. KIỂM TRA ---
function TestPage() {
  const [step, setStep] = useState('setup');
  const [duration, setDuration] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (step === 'testing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 'testing' && timeLeft === 0) setStep('result');
  }, [step, timeLeft]);

  const startTest = async () => {
    const res = await axios.get(API_URL);
    if (res.data.length < 4) return alert("Cần ít nhất 4 từ!");
    const quizData = res.data.sort(() => 0.5 - Math.random()).slice(0, 10).map(card => {
       const distractors = res.data.filter(c => c.id !== card.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.meaning);
       return { q: card.japanese, a: card.meaning, opts: [...distractors, card.meaning].sort(() => 0.5 - Math.random()) };
    });
    setQuestions(quizData); setTimeLeft(duration * 60); setScore(0); setCurrentQ(0); setStep('testing');
  };

  const handleAnswer = (opt) => {
    if (opt === questions[currentQ].a) setScore(s => s + 1);
    if (currentQ + 1 < questions.length) setCurrentQ(c => c + 1); else setStep('result');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (step === 'setup') return (
    <div style={{textAlign: 'center'}}>
      <h2 style={{fontSize: '2.5rem'}}>Kiểm tra tốc độ</h2>
      <div style={{margin: '40px 0'}}>
        <label style={{fontSize: '1.2rem'}}>Thời gian (phút): </label>
        <input type="number" className="input-glass" style={{width: '100px', textAlign: 'center', display: 'inline-block', margin: '0 10px'}} 
          value={duration} onChange={e => setDuration(e.target.value)} min="1" />
      </div>
      <button className="btn btn-primary" style={{padding: '20px 40px', fontSize: '1.2rem'}} onClick={startTest}>Bắt đầu tính giờ</button>
    </div>
  );

  if (step === 'result') return (
    <div style={{textAlign: 'center'}}>
      <h1>KẾT QUẢ</h1>
      <h2 style={{fontSize: '6rem', margin: '20px 0', color: 'var(--primary)'}}>{score} / {questions.length}</h2>
      <button className="btn btn-primary" onClick={() => setStep('setup')}>Làm lại</button>
    </div>
  );

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40}}>
        <span style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)'}}>{formatTime(timeLeft)}</span>
        <span style={{fontSize: '1.5rem'}}>Câu {currentQ + 1} / {questions.length}</span>
      </div>
      <div style={{textAlign: 'center', margin: '50px 0'}}>
        <h1 className="jp-font jp-large">{questions[currentQ].q}</h1>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        {questions[currentQ].opts.map((opt, i) => (
          <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} key={i} 
            style={{padding: '30px', background: 'rgba(255,255,255,0.6)', borderRadius: '20px', fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)'}}
            onClick={() => handleAnswer(opt)}>
            {opt}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;