import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html, MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

export default function JetonCard({ data, onNext, onPrev, onMarkLearned }) {
    const mesh = useRef();
    const [flipped, setFlipped] = useState(false);

    // Khi đổi thẻ (next/prev), tự động lật về mặt trước
    useEffect(() => { setFlipped(false); }, [data]);

    useFrame((state, delta) => {
        // 1. LOGIC LẬT: Xoay trục Y. Nếu flipped -> PI (180 độ), không thì 0.
        // Dùng easing.dampE để tạo độ trễ vật lý siêu mượt
        easing.dampE(
            mesh.current.rotation,
            [0, flipped ? Math.PI : 0, 0],
            0.25, // Thời gian lật (giây)
            delta
        );

        // 2. NGHIÊNG THEO CHUỘT (Chỉ khi chưa lật để tránh rối mắt)
        if (!flipped) {
            easing.dampE(
                mesh.current.rotation,
                [state.mouse.y * 0.1, state.mouse.x * 0.1, 0],
                0.2,
                delta
            );
        }
    });

    return (
        <group>
            {/* Float: Giúp thẻ trôi lơ lửng */}
            <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh
                    ref={mesh}
                    onClick={(e) => { e.stopPropagation(); setFlipped(!flipped); }} // Click vào thẻ để lật
                >
                    {/* BoxGeometry: Rộng 3.5, Cao 2.2, Dày 0.15 */}
                    <boxGeometry args={[3.5, 2.2, 0.15]} />

                    {/* CHẤT LIỆU KÍNH (Jeton Style) - Đã tối ưu cho mượt */}
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={0.3}
                        samples={6} // Giảm sample để đỡ lag
                        thickness={0.5}
                        chromaticAberration={0.05} // Tán sắc nhẹ
                        anisotropy={0.1}
                        distortion={0.1}
                        roughness={0.1}
                        clearcoat={1}
                        color="#ffffff"
                    />

                    {/* --- MẶT TRƯỚC (TIẾNG NHẬT) --- */}
                    <group position={[0, 0, 0.09]}>
                        <Text
                            font="https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.woff"
                            fontSize={0.5} color="black" anchorY="middle"
                        >
                            {data.japanese}
                        </Text>
                        <Text fontSize={0.12} position={[0, -0.7, 0]} color="#555" letterSpacing={0.1}>
                            CHẠM ĐỂ LẬT
                        </Text>
                    </group>

                    {/* --- MẶT SAU (TIẾNG VIỆT) --- */}
                    {/* Xoay 180 độ (PI) để khi thẻ lật lại, chữ sẽ xuôi chiều */}
                    <group rotation={[0, Math.PI, 0]} position={[0, 0, -0.09]}>
                        <Text
                            font="https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-b_Y1a4.woff"
                            fontSize={0.25} color="black" anchorY="middle" maxWidth={3} textAlign="center"
                        >
                            {data.meaning}
                        </Text>

                        {/* Nút bấm HTML gắn vào 3D */}
                        {flipped && (
                            <Html transform position={[0, -0.6, 0]} style={{ pointerEvents: 'none' }}>
                                <div style={{ display: 'flex', gap: 15, pointerEvents: 'auto' }}>
                                    {/* Nút Prev/Next/Thuộc */}
                                    <button className="btn-glass" style={{ padding: '10px 15px' }} onClick={(e) => { e.stopPropagation(); onPrev() }}>←</button>
                                    <button className="btn-glass" style={{ background: '#10b981', color: 'white', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); onMarkLearned() }}>Đã thuộc</button>
                                    <button className="btn-glass" style={{ padding: '10px 15px' }} onClick={(e) => { e.stopPropagation(); onNext() }}>→</button>
                                </div>
                            </Html>
                        )}
                    </group>
                </mesh>
            </Float>
        </group>
    );
}