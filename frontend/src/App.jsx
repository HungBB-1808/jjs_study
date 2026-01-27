import { useState, useEffect } from 'react';
import axios from 'axios';
import * as wanakana from 'wanakana';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaBrain } from 'react-icons/fa';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [inputJp, setInputJp] = useState('');
  const [inputMeaning, setInputMeaning] = useState('');
  const [loading, setLoading] = useState(false);

  // Load thẻ từ SQL Server khi mở web
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      // Gọi API Java (Cổng 8080)
      const res = await axios.get('http://localhost:8080/api/cards');
      setCards(res.data.reverse());
    } catch (err) { console.error("Chưa bật Backend Java!", err); }
  };

  const handleInputJp = (e) => {
    // Tự động chuyển Romaji -> Kana
    setInputJp(wanakana.toKana(e.target.value));
  };

  const addCard = async () => {
    if (!inputJp || !inputMeaning) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/cards', {
        japanese: inputJp,
        meaning: inputMeaning,
        example: "Đang chờ AI tạo ví dụ..." 
      });
      await fetchCards();
      setInputJp(''); setInputMeaning('');
    } catch (error) { alert("Lỗi lưu! Kiểm tra Server Java."); }
    setLoading(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: 30, textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
        🇯🇵 Nihongo AI Master
      </motion.h1>

      {/* KHUNG NHẬP LIỆU */}
      <motion.div className="glass" style={{ padding: 30, marginBottom: 40 }}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        
        <input className="input-glass" 
          value={inputJp} onChange={handleInputJp} 
          placeholder="Nhập Romaji (VD: watashi -> わたし)..." />
        
        <input className="input-glass"
          value={inputMeaning} onChange={(e) => setInputMeaning(e.target.value)}
          placeholder="Nghĩa tiếng Việt..." />

        <motion.button className="btn-primary" onClick={addCard} whileTap={{ scale: 0.95 }}>
          {loading ? <FaSync className="spin"/> : '+ Thêm thẻ mới'}
        </motion.button>
      </motion.div>

      {/* DANH SÁCH THẺ (FLASHCARDS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnimatePresence>
          {cards.map(card => (
            <FlashCard key={card.id} data={card} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// COMPONENT THẺ CON (Hiệu ứng lật)
const FlashCard = ({ data }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ height: 200, perspective: 1000, cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
      <motion.div 
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        
        {/* MẶT TRƯỚC */}
        <div className="glass" style={{ 
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: 'bold'
        }}>
          {data.japanese}
        </div>

        {/* MẶT SAU */}
        <div className="glass" style={{ 
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 20, textAlign: 'center', background: 'rgba(255,255,255,0.25)'
        }}>
          <h3 style={{ margin: 0 }}>{data.meaning}</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: 10 }}>
            <FaBrain /> {data.example}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;