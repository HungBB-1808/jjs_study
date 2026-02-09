import React, { useRef, useEffect } from "react";
import "./ScrollPicker.css"; // Chúng ta sẽ tạo file css này ở bước sau

export default function ScrollPicker({ items, value, onChange, label }) {
  const containerRef = useRef(null);
  const itemHeight = 60; // Chiều cao mỗi số

  // Tự động cuộn tới giá trị đang chọn khi mở
  useEffect(() => {
    if (containerRef.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value, items]);

  // Xử lý khi cuộn dừng lại
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (items[index] !== undefined && items[index] !== value) {
      // Dùng debounce nhẹ hoặc set trực tiếp nếu muốn phản hồi tức thì
      // Ở đây ta set luôn vì React 18 xử lý tốt
      // onChange(items[index]); 
      // Tuy nhiên, để tối ưu performance, ta chỉ set khi người dùng bấm hoặc scroll dừng hẳn
      // (Logic snap css sẽ lo việc dừng đúng chỗ)
    }
  };
  
  // Sự kiện khi click vào một số
  const handleClick = (item) => {
    onChange(item);
  };

  return (
    <div className="picker-wrapper">
      <div className="picker-label">{label}</div>
      <div className="picker-container">
        {/* Lớp phủ mờ trên dưới */}
        <div className="picker-gradient-top"></div>
        <div className="picker-gradient-bottom"></div>
        
        {/* Thanh chọn ở giữa */}
        <div className="picker-highlight"></div>

        <div 
          className="picker-scroll-area" 
          ref={containerRef}
          onScroll={(e) => {
             // Tính toán index dựa trên scroll
             const index = Math.round(e.target.scrollTop / itemHeight);
             if(items[index] && items[index] !== value) onChange(items[index]);
          }}
        >
          {/* Padding giả để số đầu tiên và cuối cùng có thể nằm giữa */}
          <div style={{ height: itemHeight * 2 }} /> 
          
          {items.map((item) => (
            <div 
              key={item} 
              className={`picker-item ${item === value ? "active" : ""}`}
              onClick={() => handleClick(item)}
              style={{ height: itemHeight }}
            >
              {item}
            </div>
          ))}
          
          <div style={{ height: itemHeight * 2 }} />
        </div>
      </div>
    </div>
  );
}