import React, { useState, useEffect, Suspense, useRef } from 'react';
import axios from 'axios';
import * as wanakana from 'wanakana';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaLayerGroup, FaGraduationCap, FaClock } from 'react-icons/fa';
import JetonCard from './JetonCard'; // Giữ nguyên file JetonCard cũ
import './App.css';

const API_URL = "http://localhost:8080/api/cards";

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
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

const PageAnim = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    style={{width:'100%', height:'100%'}}
  >
    {children}
  </motion.div>
);

// --- COMPONENT CHỌN SỐ (Scroll Picker Dọc) ---
const ScrollPicker = ({ items, value, onChange }) => {
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
          <Link key={t.p} to={t.p} style={{textDecoration:'none'}}>
            <div className={`nav-item ${active?'active':''}`}>
              {/* Hiệu ứng Liquid Trượt */}
              {active && <motion.div layoutId="pill" className="active-pill" transition={{type:'spring', stiffness:300, damping:30}} />}
              {t.i} {t.l}
            </div>
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
    <div style={{textAlign:'center', paddingTop: 150, pointerEvents: 'auto'}}>
      <h1 style={{fontSize:'3rem', fontWeight:200, marginBottom:40}}>THÊM TỪ MỚI</h1>
      <button onClick={()=>setAuto(!auto)} style={{background:'none', border:'1px solid #555', color:'#888', padding:'5px 15px', borderRadius:20, marginBottom:20, cursor:'pointer'}}>
        {auto ? "🟢 Auto Hiragana" : "⚪ Kanji Mode"}
      </button><br/>
      <input className="input-line" value={jp} onChange={e=>auto?setJp(wanakana.toKana(e.target.value)):setJp(e.target.value)} placeholder="Nhập tiếng Nhật" /><br/>
      <input className="input-line" value={mn} onChange={e=>setMn(e.target.value)} placeholder="Nhập nghĩa tiếng Việt" /><br/>
      <button className="btn-glass" onClick={save} style={{marginTop:30}}>Lưu Thẻ</button>
    </div>
  );
}

function LibraryPage() {
  const [cards, setCards] = useState([]);
  useEffect(()=>{ axios.get(API_URL).then(res=>setCards(res.data.reverse())) }, []);
  return (
    <div className="library-container">
      <h1 style={{textAlign:'center', fontSize:'2.5rem', marginBottom:40}}>KHO TỪ VỰNG ({cards.length})</h1>
      <div className="grid-6-col">
        {cards.map(c=>(
          <div key={c.id} className="glass-card-item">
            <h2 style={{margin:'0 0 10px 0', fontSize:'1.8rem'}}>{c.japanese}</h2>
            <p style={{margin:0, opacity:0.7}}>{c.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        ))}
      </div>
    </div>
  );

  return <div style={{textAlign:'center', paddingTop:150, pointerEvents: 'auto'}}><h1>Kết quả: {quiz.score}/{quiz.q.length}</h1><button className="btn-glass" onClick={()=>setStep('setup')}>Thi Lại</button></div>;
}