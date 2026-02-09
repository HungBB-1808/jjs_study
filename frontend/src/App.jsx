import React, { useState, useEffect, Suspense, useRef } from 'react';
import axios from 'axios';
import * as wanakana from 'wanakana';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaLayerGroup, FaGraduationCap, FaClock } from 'react-icons/fa';
import JetonCard from './JetonCard'; // Giữ nguyên file JetonCard cũ
=======
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaLayerGroup, FaGraduationCap, FaClock, 
  FaCheck, FaArrowRight, FaArrowLeft, FaRedo, 
  FaRandom, FaKeyboard 
} from 'react-icons/fa';
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
import './App.css';

const API_URL = "http://localhost:8080/api/cards";

export default function App() {
  return (
    <Router>
<<<<<<< HEAD
      <MainLayout />
=======
      <div className="app-container">
        <Navbar />
        <AnimatePresence mode="wait">
          <RoutesWrapper />
        </AnimatePresence>
      </div>
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
    </Router>
  );
}

<<<<<<< HEAD
function MainLayout() {
=======
function RoutesWrapper() {
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
  const location = useLocation();
  const [studyCards, setStudyCards] = useState([]);
  const [studyIndex, setStudyIndex] = useState(0);

  // Load data
  useEffect(() => {
    const load = async () => {
      const learned = JSON.parse(localStorage.getItem('learned') || "[]");
      try {
        const res = await axios.get(API_URL);
        // Lọc thẻ chưa thuộc
        setStudyCards(res.data.filter(c => !learned.includes(c.id)));
      } catch (e) { console.error("Lỗi load thẻ:", e); }
    };
    load();
  }, [location.pathname]);

  const handleNext = () => setStudyIndex((i) => (i + 1) % studyCards.length);
  const handlePrev = () => setStudyIndex((i) => (i - 1 + studyCards.length) % studyCards.length);
  const handleLearned = () => {
    const c = studyCards[studyIndex];
    const learned = JSON.parse(localStorage.getItem('learned') || "[]");
    localStorage.setItem('learned', JSON.stringify([...learned, c.id]));
    setStudyCards(studyCards.filter(x => x.id !== c.id));
    setStudyIndex(0);
  };

  return (
    <>
      {/* 1. LAYER 3D (CHỈ HIỆN KHI Ở TRANG STUDY) */}
      <div className="canvas-layer" style={{ opacity: location.pathname === '/study' ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
          {/* Môi trường phản chiếu cho kính */}
          <Environment preset="city" blur={0.8} />
          
          {/* Thẻ 3D */}
          <Suspense fallback={null}>
            {studyCards.length > 0 && (
              <JetonCard 
                data={studyCards[studyIndex]} 
                onNext={handleNext} 
                onPrev={handlePrev} 
                onMarkLearned={handleLearned}
              />
            )}
          </Suspense>
          
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} />
        </Canvas>
      </div>

      {/* 2. LAYER UI HTML */}
      <div className="ui-layer">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageAnim><AddPage /></PageAnim>} />
            <Route path="/library" element={<PageAnim><LibraryPage /></PageAnim>} />
            
            {/* TRANG HỌC (STUDY UI) */}
            <Route path="/study" element={<PageAnim>
               {studyCards.length > 0 ? (
                 <div style={{position:'absolute', top: 100, width:'100%', textAlign:'center', opacity:0.5}}>
                   #{studyIndex + 1} / {studyCards.length}
                 </div>
               ) : (
                 /* Fallback khi hết thẻ hoặc đang load */
                 <div style={{textAlign:'center', marginTop: 300, pointerEvents: 'auto'}}>
                   {studyCards.length === 0 ? 
                     (<><h1>Đã thuộc hết! 🎉</h1><button className="btn-glass" onClick={()=>{localStorage.removeItem('learned'); window.location.reload()}}>Học Lại</button></>) : 
                     (<h1>Đang tải thẻ...</h1>) // Tránh màn hình đen
                   }
                 </div>
               )}
            </PageAnim>} />
            
            <Route path="/test" element={<PageAnim><TestPage /></PageAnim>} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

<<<<<<< HEAD
const PageAnim = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    style={{width:'100%', height:'100%'}}
=======
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.98 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="glass-panel"
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
  >
    {children}
  </motion.div>
);

<<<<<<< HEAD
// --- COMPONENT CHỌN SỐ (Scroll Picker Dọc) ---
const ScrollPicker = ({ items, value, onChange }) => {
=======
// --- NAVBAR ---
function Navbar() {
  const location = useLocation();
  const tabs = [
    { path: '/', label: 'Thêm thẻ', icon: <FaPlus /> },
    { path: '/library', label: 'Kho thẻ', icon: <FaLayerGroup /> },
    { path: '/study', label: 'Ôn tập', icon: <FaGraduationCap /> },
    { path: '/test', label: 'Kiểm tra', icon: <FaClock /> },
  ];

>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
  return (
    <div className="number-selector">
      <div className="picker-mask" /> {/* Gradient mờ */}
      <div style={{height: 100}} /> {/* Padding để số đầu nằm giữa */}
      {items.map(item => (
        <div 
          key={item} 
          className={`num-btn ${item === value ? 'selected' : ''}`}
          onClick={() => onChange(item)}
        >
          {item}
        </div>
      ))}
      <div style={{height: 100}} /> {/* Padding để số cuối nằm giữa */}
    </div>
  );
};

function Navbar() {
  const loc = useLocation();
  const tabs = [{p:'/',l:'THÊM',i:<FaPlus/>}, {p:'/library',l:'KHO',i:<FaLayerGroup/>}, {p:'/study',l:'HỌC',i:<FaGraduationCap/>}, {p:'/test',l:'THI',i:<FaClock/>}];
  return (
    <div className="nav-dock">
      {tabs.map(t => {
        const active = loc.pathname === t.p;
        return (
<<<<<<< HEAD
          <Link key={t.p} to={t.p} style={{textDecoration:'none'}}>
            <div className={`nav-item ${active?'active':''}`}>
              {/* Hiệu ứng Liquid Trượt */}
              {active && <motion.div layoutId="pill" className="active-pill" transition={{type:'spring', stiffness:300, damping:30}} />}
              {t.i} {t.l}
            </div>
=======
          <Link key={tab.path} to={tab.path} style={{ textDecoration: 'none', position: 'relative' }}>
            <button className={`nav-item ${isActive ? 'selected' : ''}`}>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="active-pill"
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {tab.icon} {tab.label}
              </span>
            </button>
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
          </Link>
        )
      })}
    </div>
  );
}

function AddPage() {
  const [jp, setJp] = useState('');
  const [mn, setMn] = useState('');
  const [auto, setAuto] = useState(true);
  
  const save = async () => { 
    if(!jp) return; 
    await axios.post(API_URL, {japanese:jp, meaning:mn}); 
    setJp(''); setMn(''); alert("Đã lưu!"); 
  };

  return (
<<<<<<< HEAD
    <div style={{textAlign:'center', paddingTop: 150, pointerEvents: 'auto'}}>
      <h1 style={{fontSize:'3rem', fontWeight:200, marginBottom:40}}>THÊM TỪ MỚI</h1>
      <button onClick={()=>setAuto(!auto)} style={{background:'none', border:'1px solid #555', color:'#888', padding:'5px 15px', borderRadius:20, marginBottom:20, cursor:'pointer'}}>
        {auto ? "🟢 Auto Hiragana" : "⚪ Kanji Mode"}
      </button><br/>
      <input className="input-line" value={jp} onChange={e=>auto?setJp(wanakana.toKana(e.target.value)):setJp(e.target.value)} placeholder="Nhập tiếng Nhật" /><br/>
      <input className="input-line" value={mn} onChange={e=>setMn(e.target.value)} placeholder="Nhập nghĩa tiếng Việt" /><br/>
      <button className="btn-glass" onClick={save} style={{marginTop:30}}>Lưu Thẻ</button>
=======
    <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
      <h2 style={{fontSize: '2.5rem', marginBottom: '30px'}}>Thêm từ vựng mới</h2>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30, gap: 15}}>
        <button className="btn" style={{background: isAutoMode ? 'var(--primary)' : 'rgba(255,255,255,0.5)', color: isAutoMode ? '#fff' : '#000'}} onClick={() => setIsAutoMode(true)}>Auto Hiragana</button>
        <button className="btn" style={{background: !isAutoMode ? 'var(--primary)' : 'rgba(255,255,255,0.5)', color: !isAutoMode ? '#fff' : '#000'}} onClick={() => setIsAutoMode(false)}><FaKeyboard /> Kanji</button>
      </div>
      <input className="input-glass jp-font" value={jp} onChange={handleInputJp} placeholder={isAutoMode ? "romaji (vd: neko)" : "Nhập Kanji..."} />
      <input className="input-glass" value={meaning} onChange={e => setMeaning(e.target.value)} placeholder="Nghĩa tiếng Việt" />
      <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}} onClick={addCard}>Lưu vào kho</button>
      {status && <p style={{marginTop: 20, fontSize: '1.2rem', fontWeight: 'bold', color: '#059669'}}>{status}</p>}
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
    </div>
  );
}

function LibraryPage() {
  const [cards, setCards] = useState([]);
  useEffect(()=>{ axios.get(API_URL).then(res=>setCards(res.data.reverse())) }, []);
  return (
<<<<<<< HEAD
    <div className="library-container">
      <h1 style={{textAlign:'center', fontSize:'2.5rem', marginBottom:40}}>KHO TỪ VỰNG ({cards.length})</h1>
      <div className="grid-6-col">
        {cards.map(c=>(
          <div key={c.id} className="glass-card-item">
            <h2 style={{margin:'0 0 10px 0', fontSize:'1.8rem'}}>{c.japanese}</h2>
            <p style={{margin:0, opacity:0.7}}>{c.meaning}</p>
=======
    <div>
      <h2 style={{textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px'}}>Kho từ vựng ({cards.length})</h2>
      <div className="grid-container">
        {cards.map(c => (
          <div key={c.id} className="mini-card">
            <h3 className="jp-font" style={{margin: '0 0 10px 0', fontSize: '2rem', color: 'var(--primary)'}}>{c.japanese}</h3>
            <p style={{margin: 0, fontSize: '1.2rem', color: '#4b5563'}}>{c.meaning}</p>
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
          </div>
        ))}
      </div>
    </div>
  );
}

<<<<<<< HEAD
function TestPage() {
  const [step, setStep] = useState('setup');
  const [time, setTime] = useState(1);
  const [count, setCount] = useState(5);
  const [total, setTotal] = useState(0);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => { axios.get(API_URL).then(res => setTotal(res.data.length)) }, []);

  const times = Array.from({length:60}, (_,i)=>i+1);
  const counts = Array.from({length:total||10}, (_,i)=>i+1);

  const start = async () => {
    const res = await axios.get(API_URL);
    if(res.data.length < 4) return alert("Cần ít nhất 4 từ!");
    const q = res.data.sort(()=>0.5-Math.random()).slice(0,count).map(c=>{
       const isJp = Math.random()>0.5;
       const opts = res.data.filter(x=>x.id!==c.id).slice(0,3).map(x=>isJp?x.meaning:x.japanese);
       return { q: isJp?c.japanese:c.meaning, a: isJp?c.meaning:c.japanese, o: [...opts, isJp?c.meaning:c.japanese].sort(()=>0.5-Math.random()), isJp }
    });
    setQuiz({q, curr:0, score:0, time:time*60}); setStep('play');
=======
// --- 3. ÔN TẬP ---
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
          <div className="card-face front">
            <h1 className="jp-font jp-large">{current.japanese}</h1>
            <p style={{marginTop: 30, opacity: 0.6, fontSize: '1.2rem'}}>(Chạm để lật)</p>
          </div>
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

// --- 4. KIỂM TRA (ĐÃ NÂNG CẤP) ---
function TestPage() {
  const [step, setStep] = useState('setup');
  const [duration, setDuration] = useState(1);
  const [numQuestions, setNumQuestions] = useState(10); // Thêm state số lượng câu
  const [totalCards, setTotalCards] = useState([]); // Lưu toàn bộ thẻ để biết max
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  // Lấy danh sách thẻ khi vào trang để biết có bao nhiêu thẻ
  useEffect(() => {
    axios.get(API_URL).then(res => {
      setTotalCards(res.data);
      // Mặc định chọn max 10 câu hoặc tổng số thẻ nếu ít hơn
      setNumQuestions(Math.min(10, res.data.length));
    });
  }, []);

  useEffect(() => {
    if (step === 'testing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 'testing' && timeLeft === 0) setStep('result');
  }, [step, timeLeft]);

  const startTest = () => {
    if (totalCards.length < 4) return alert("Cần ít nhất 4 thẻ để tạo trắc nghiệm!");
    if (numQuestions < 1 || numQuestions > totalCards.length) return alert("Số lượng câu không hợp lệ!");

    // 1. Trộn và lấy đúng số lượng câu người dùng chọn
    const selectedCards = [...totalCards].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    
    // 2. Tạo câu hỏi (Random chiều hỏi)
    const quizData = selectedCards.map(card => {
       // Tung đồng xu: 50% hỏi Nhật, 50% hỏi Việt
       const isJpQuestion = Math.random() > 0.5;

       if (isJpQuestion) {
         // Hỏi: Tiếng Nhật -> Đáp án: Tiếng Việt
         const distractors = totalCards
           .filter(c => c.id !== card.id)
           .sort(() => 0.5 - Math.random())
           .slice(0, 3)
           .map(c => c.meaning); // Lấy nghĩa làm đáp án nhiễu
         
         return { 
           q: card.japanese, 
           a: card.meaning, 
           opts: [...distractors, card.meaning].sort(() => 0.5 - Math.random()),
           isJp: true // Đánh dấu là câu hỏi tiếng Nhật (để chỉnh font to)
         };
       } else {
         // Hỏi: Tiếng Việt -> Đáp án: Tiếng Nhật
         const distractors = totalCards
            .filter(c => c.id !== card.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => c.japanese); // Lấy tiếng Nhật làm đáp án nhiễu

          return {
            q: card.meaning,
            a: card.japanese,
            opts: [...distractors, card.japanese].sort(() => 0.5 - Math.random()),
            isJp: false // Đánh dấu câu hỏi tiếng Việt
          };
       }
    });

    setQuestions(quizData); 
    setTimeLeft(duration * 60); 
    setScore(0); 
    setCurrentQ(0); 
    setStep('testing');
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
  };

  useEffect(()=>{
    if(step==='play' && quiz?.time>0) {
      const t = setInterval(()=>setQuiz(p=>({...p, time:p.time-1})),1000);
      return ()=>clearInterval(t);
    } else if(step==='play' && quiz?.time===0) setStep('result');
  },[step, quiz?.time]);

  const ans = (o) => {
    if(o===quiz.q[quiz.curr].a) setQuiz(p=>({...p, score:p.score+1}));
    if(quiz.curr+1<quiz.q.length) setQuiz(p=>({...p, curr:p.curr+1})); else setStep('result');
  };

<<<<<<< HEAD
  if(step === 'setup') return (
    <div style={{textAlign:'center', paddingTop: 100, pointerEvents: 'auto'}}>
      <h1 style={{marginBottom: 50}}>THIẾT LẬP BÀI THI</h1>
      
      {/* 2 CỘT CHỌN ĐỐI XỨNG */}
      <div className="test-setup-container">
        <div className="picker-group">
          {/* Label cố định chiều cao để không lệch */}
          <div className="picker-label">Thời gian<br/>(Phút)</div>
          <ScrollPicker items={times} value={time} onChange={setTime} />
        </div>
        <div className="picker-group">
          <div className="picker-label">Số câu<br/>hỏi</div>
          <ScrollPicker items={counts} value={count} onChange={setCount} />
        </div>
      </div>

      <button className="btn-glass" onClick={start} style={{marginTop: 30}}>BẮT ĐẦU</button>
    </div>
  );

  if(step === 'play') return (
    <div style={{textAlign:'center', paddingTop: 100, pointerEvents: 'auto'}}>
      <h2>⏱ {Math.floor(quiz.time/60)}:{(quiz.time%60).toString().padStart(2,'0')}</h2>
      <h1 style={{fontSize: quiz.q[quiz.curr].isJp?'4rem':'3rem', margin:'40px 0'}}>{quiz.q[quiz.curr].q}</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:600, margin:'0 auto'}}>
        {quiz.q[quiz.curr].o.map((o,i)=>(
          <button key={i} onClick={()=>ans(o)} style={{padding:20, background:'rgba(255,255,255,0.1)', border:'1px solid #555', color:'white', borderRadius:16, cursor:'pointer', fontSize:'1.2rem'}}>{o}</button>
=======
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // --- GIAO DIỆN SETUP ---
  if (step === 'setup') return (
    <div style={{textAlign: 'center'}}>
      <h2 style={{fontSize: '2.5rem'}}>Cấu hình bài kiểm tra</h2>
      <p style={{fontSize: '1.1rem', opacity: 0.7}}>Tổng kho thẻ hiện có: <b>{totalCards.length}</b></p>

      <div style={{display: 'flex', justifyContent: 'center', gap: 40, margin: '40px 0', flexWrap: 'wrap'}}>
        {/* Chọn thời gian */}
        <div>
          <label style={{display: 'block', marginBottom: 10, fontSize: '1.2rem', fontWeight: 'bold'}}>Thời gian (phút)</label>
          <input type="number" className="input-glass" style={{width: '120px', textAlign: 'center'}} 
            value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" />
        </div>

        {/* Chọn số câu hỏi */}
        <div>
          <label style={{display: 'block', marginBottom: 10, fontSize: '1.2rem', fontWeight: 'bold'}}>Số câu hỏi</label>
          <input type="number" className="input-glass" style={{width: '120px', textAlign: 'center'}} 
            value={numQuestions} 
            onChange={e => setNumQuestions(Number(e.target.value))} 
            min="1" max={totalCards.length} 
          />
        </div>
      </div>

      <button className="btn btn-primary" style={{padding: '20px 40px', fontSize: '1.2rem'}} onClick={startTest}>
        Bắt đầu làm bài
      </button>
    </div>
  );

  // --- GIAO DIỆN KẾT QUẢ ---
  if (step === 'result') return (
    <div style={{textAlign: 'center'}}>
      <h1>KẾT QUẢ</h1>
      <h2 style={{fontSize: '6rem', margin: '20px 0', color: 'var(--primary)'}}>{score} / {questions.length}</h2>
      <p style={{fontSize: '1.5rem'}}>
        {score === questions.length ? "Tuyệt vời! Bạn đúng hết rồi 🎉" : "Cố gắng hơn lần sau nhé 💪"}
      </p>
      <button className="btn btn-primary" onClick={() => setStep('setup')}>Làm bài khác</button>
    </div>
  );

  // --- GIAO DIỆN LÀM BÀI ---
  const currentQuestion = questions[currentQ];
  
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40}}>
        <span style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)'}}>{formatTime(timeLeft)}</span>
        <span style={{fontSize: '1.5rem'}}>Câu {currentQ + 1} / {questions.length}</span>
      </div>

      <div style={{textAlign: 'center', margin: '50px 0', minHeight: '150px'}}>
        {/* Nếu câu hỏi là tiếng Nhật -> Font to (jp-large). Nếu là tiếng Việt -> Font vừa (vi-large) */}
        <h1 className={`jp-font ${currentQuestion.isJp ? 'jp-large' : 'vi-large'}`}>
          {currentQuestion.q}
        </h1>
        <p style={{opacity: 0.6, fontSize: '1.1rem', marginTop: 10}}>
          {currentQuestion.isJp ? "(Chọn nghĩa tiếng Việt)" : "(Chọn từ tiếng Nhật)"}
        </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        {currentQuestion.opts.map((opt, i) => (
          <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} key={i} 
            style={{
              padding: '30px', 
              background: 'rgba(255,255,255,0.6)', 
              borderRadius: '20px', 
              fontSize: '1.3rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              cursor: 'pointer', 
              border: '1px solid rgba(255,255,255,0.5)',
              // Nếu đáp án là tiếng Nhật thì dùng font Nhật
              fontFamily: !currentQuestion.isJp ? "'Noto Sans JP', sans-serif" : 'inherit'
            }}
            onClick={() => handleAnswer(opt)}>
            {opt}
          </motion.div>
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
        ))}
      </div>
    </div>
  );

<<<<<<< HEAD
  return <div style={{textAlign:'center', paddingTop:150, pointerEvents: 'auto'}}><h1>Kết quả: {quiz.score}/{quiz.q.length}</h1><button className="btn-glass" onClick={()=>setStep('setup')}>Thi Lại</button></div>;
}
=======
export default App;
>>>>>>> 25c8e5cc5ce630ff13bf420021df9b6d7b07d4a9
