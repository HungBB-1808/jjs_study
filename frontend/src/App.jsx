import { useState, useEffect } from 'react';
import axios from 'axios';
import * as wanakana from 'wanakana';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaPlus, FaLayerGroup, FaGraduationCap, FaClock, FaCheck, FaArrowRight, FaArrowLeft, FaRedo, FaRandom, FaKeyboard } from 'react-icons/fa';
import './App.css';

const API_URL = "http://localhost:8080/api/cards";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  return (
    <nav className="navbar">
      <Link to="/" className={`nav-link ${isActive('/')}`}><FaPlus /> Thêm thẻ</Link>
      <Link to="/library" className={`nav-link ${isActive('/library')}`}><FaLayerGroup /> Kho thẻ</Link>
      <Link to="/study" className={`nav-link ${isActive('/study')}`}><FaGraduationCap /> Ôn tập</Link>
      <Link to="/test" className={`nav-link ${isActive('/test')}`}><FaClock /> Kiểm tra</Link>
    </nav>
  );
}

// --- 1. NHẬP LIỆU ---
function AddPage() {
  const [jp, setJp] = useState('');
  const [meaning, setMeaning] = useState('');
  const [status, setStatus] = useState(null);
  const [isAutoMode, setIsAutoMode] = useState(true); // <--- Thêm trạng thái này

  // Hàm xử lý nhập liệu thông minh
  const handleInputJp = (e) => {
    const val = e.target.value;
    if (isAutoMode) {
      // Nếu bật Auto: Chuyển Romaji -> Hiragana
      setJp(wanakana.toKana(val));
    } else {
      // Nếu tắt Auto: Nhập thô (để dùng IME gõ Kanji hoặc paste)
      setJp(val);
    }
  };

  const addCard = async () => {
    if (!jp || !meaning) return;
    try {
      await axios.post(API_URL, { japanese: jp, meaning: meaning, example: "Từ vựng cá nhân" });
      setStatus('✅ Lưu thành công!'); setJp(''); setMeaning('');
      setTimeout(() => setStatus(null), 2000);
    } catch { setStatus('❌ Lỗi kết nối!'); }
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <h2>✨ Thêm từ vựng mới</h2>

      {/* Nút chuyển chế độ nhập */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, gap: 10 }}>
        <button
          className="btn"
          style={{
            background: isAutoMode ? 'var(--primary)' : '#e5e7eb',
            color: isAutoMode ? 'white' : '#333',
            fontSize: '0.9rem', padding: '8px 15px'
          }}
          onClick={() => setIsAutoMode(true)}
        >
          🅰️ Auto Hiragana
        </button>
        <button
          className="btn"
          style={{
            background: !isAutoMode ? 'var(--primary)' : '#e5e7eb',
            color: !isAutoMode ? 'white' : '#333',
            fontSize: '0.9rem', padding: '8px 15px'
          }}
          onClick={() => setIsAutoMode(false)}
        >
          <FaKeyboard /> Nhập Kanji/Thô
        </button>
      </div>

      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 15, fontStyle: 'italic' }}>
        {isAutoMode
          ? "Đang bật: Gõ 'neko' sẽ thành 'ねこ'"
          : "Đang tắt: Hãy dùng bàn phím tiếng Nhật của máy để gõ Kanji"}
      </p>

      <input
        className="input-glass jp-font"
        value={jp}
        onChange={handleInputJp}
        placeholder={isAutoMode ? "Nhập Romaji (vd: arigatou)" : "Nhập Kanji hoặc Paste vào đây"}
      />
      <input
        className="input-glass"
        value={meaning}
        onChange={e => setMeaning(e.target.value)}
        placeholder="Nghĩa tiếng Việt (VD: Cảm ơn)"
      />

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={addCard}>Lưu ngay</button>
      {status && <p style={{ marginTop: 15, fontWeight: 'bold', color: status.includes('Lỗi') ? 'red' : 'green' }}>{status}</p>}
    </div>
  );
}

// --- 2. KHO THẺ ---
function LibraryPage() {
  const [cards, setCards] = useState([]);
  useEffect(() => { axios.get(API_URL).then(res => setCards(res.data.reverse())); }, []);

  return (
    <div className="glass-panel">
      <h2 style={{ textAlign: 'center' }}>🗂️ Kho từ vựng ({cards.length})</h2>
      <div className="grid-container">
        {cards.map(c => (
          <div key={c.id} className="mini-card">
            <h3 className="jp-font" style={{ color: 'var(--primary)', margin: '0 0 5px 0', fontSize: '1.5rem' }}>{c.japanese}</h3>
            <p style={{ margin: 0, color: '#333' }}>{c.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. ÔN TẬP (Có nút Trộn) ---
function StudyPage() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('learned_cards')) || [];
    setLearnedIds(saved);
    axios.get(API_URL).then(res => {
      setCards(res.data.filter(c => !saved.includes(c.id)));
    });
  }, []);

  // Hàm trộn thẻ
  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setFlipped(false);
  };

  const nextCard = () => { setFlipped(false); setIndex((prev) => (prev + 1) % cards.length); };
  const prevCard = () => { setFlipped(false); setIndex((prev) => (prev - 1 + cards.length) % cards.length); };

  const markLearned = () => {
    const card = cards[index];
    const newLearned = [...learnedIds, card.id];
    setLearnedIds(newLearned);
    localStorage.setItem('learned_cards', JSON.stringify(newLearned));

    const remaining = cards.filter(c => c.id !== card.id);
    setCards(remaining);
    setIndex(0); setFlipped(false);
  };

  const resetProgress = () => {
    localStorage.removeItem('learned_cards');
    window.location.reload();
  };

  if (cards.length === 0) return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <h2>🎉 Tuyệt vời!</h2>
      <p>Bạn đã thuộc hết từ vựng.</p>
      <button className="btn btn-outline" onClick={resetProgress}><FaRedo /> Học lại từ đầu</button>
    </div>
  );

  const current = cards[index];

  return (
    <div className="glass-panel study-container">
      {/* Thanh công cụ trên cùng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#555' }}>Thẻ {index + 1} / {cards.length}</span>

        <div style={{ display: 'flex', gap: 10 }}>
          {/* Nút trộn thẻ mới */}
          <button onClick={shuffleCards} className="btn btn-outline" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>
            <FaRandom /> Trộn thẻ
          </button>
          <button onClick={markLearned} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5 }}>
            <FaCheck /> Đã thuộc
          </button>
        </div>
      </div>

      {/* Thẻ học */}
      <div className="big-card-area" onClick={() => setFlipped(!flipped)}>
        <div className={`big-card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-face front">
            <h1 className="jp-font" style={{ fontSize: '4rem', color: '#333', margin: 0 }}>{current.japanese}</h1>
            <p style={{ color: '#999', marginTop: 10 }}>Chạm để xem nghĩa</p>
          </div>
          <div className="card-face back">
            <h2 style={{ fontSize: '2.5rem', color: '#333' }}>{current.meaning}</h2>
          </div>
        </div>
      </div>

      {/* Mũi tên điều hướng - Đã làm to và rõ */}
      <div className="controls-bar">
        <button className="nav-btn" onClick={prevCard}><FaArrowLeft /></button>
        <span style={{ color: '#888', fontStyle: 'italic' }}>Chạm thẻ để lật</span>
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
    if (res.data.length < 4) return alert("Cần ít nhất 4 từ để kiểm tra!");

    const quizData = res.data.sort(() => 0.5 - Math.random()).slice(0, 10).map(card => {
      const distractors = res.data.filter(c => c.id !== card.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.meaning);
      return { q: card.japanese, a: card.meaning, opts: [...distractors, card.meaning].sort(() => 0.5 - Math.random()) };
    });

    setQuestions(quizData);
    setTimeLeft(duration * 60);
    setScore(0); setCurrentQ(0);
    setStep('testing');
  };

  const handleAnswer = (opt) => {
    if (opt === questions[currentQ].a) setScore(s => s + 1);
    if (currentQ + 1 < questions.length) setCurrentQ(c => c + 1);
    else setStep('result');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (step === 'setup') return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <h2>⏱️ Kiểm tra tốc độ</h2>
      <div style={{ margin: '30px 0' }}>
        <label>Thời gian (phút): </label>
        <input type="number" className="input-glass" style={{ width: '80px', textAlign: 'center', display: 'inline-block' }}
          value={duration} onChange={e => setDuration(e.target.value)} min="1" max="60" />
      </div>
      <button className="btn btn-primary" onClick={startTest}>Bắt đầu tính giờ</button>
    </div>
  );

  if (step === 'result') return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <h1>KẾT QUẢ</h1>
      <h2 style={{ fontSize: '4rem', margin: '20px 0', color: 'var(--primary)' }}>{score} / {questions.length}</h2>
      <button className="btn btn-primary" onClick={() => setStep('setup')}>Làm bài khác</button>
    </div>
  );

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="timer-box">{formatTime(timeLeft)}</span>
        <span style={{ fontWeight: 'bold' }}>Câu {currentQ + 1} / {questions.length}</span>
      </div>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 className="jp-font" style={{ fontSize: '3.5rem' }}>{questions[currentQ].q}</h1>
      </div>

      <div className="quiz-grid">
        {questions[currentQ].opts.map((opt, i) => (
          <div key={i} className="quiz-opt" onClick={() => handleAnswer(opt)}>{opt}</div>
        ))}
      </div>
    </div>
  );
}

export default App;