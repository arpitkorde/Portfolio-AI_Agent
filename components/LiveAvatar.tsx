
import React, { useEffect, useRef, useState } from 'react';

// Fallback to Google Drive link provided by user (using lh3 domain for better embedding)
const AVATAR_URL = "https://lh3.googleusercontent.com/d/1ql3e708Cr8cQdGiTfeRD_p4KwbSU_2_2";

interface LiveAvatarProps {
  isSpeaking: boolean;
  className?: string;
}

const LiveAvatar: React.FC<LiveAvatarProps> = ({ isSpeaking, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Configuration for the "Jaw Drop" animation
  const FACE_CONFIG = {
    jawY: 0.62,
    jawHeight: 0.38,
    mouthOpeningMax: 15,
    jawWidthScale: 0.6,
  };

  useEffect(() => {
    const img = new Image();
    img.src = AVATAR_URL;
    // img.crossOrigin = "anonymous"; // Removed to avoid CORS issues with Drive

    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setUseFallback(false);
      drawFrame(0);
    };

    img.onerror = () => {
      console.warn("Avatar image not found. Using generated fallback.");
      setUseFallback(true);
      setImageLoaded(true);
      drawFrame(0);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    if (isSpeaking) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpeaking, imageLoaded, useFallback]);

  const startAnimation = () => {
    const startTime = Date.now();

    const animate = () => {
      const time = Date.now() - startTime;
      const offset = Math.abs(Math.sin(time * 0.015)) * FACE_CONFIG.mouthOpeningMax;

      drawFrame(offset);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    drawFrame(0);
  };

  const drawFallbackFace = (ctx: CanvasRenderingContext2D, w: number, h: number, jawOffset: number) => {
    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;

    // Shoulders/Jacket (Blue suit)
    ctx.fillStyle = "#3b82f6"; // Blue
    ctx.beginPath();
    ctx.ellipse(centerX, h + 20, w * 0.45, h * 0.35, 0, Math.PI, 0);
    ctx.fill();

    // Shirt (Cyan/Light Blue)
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.moveTo(centerX - 30, h);
    ctx.lineTo(centerX, h - 40);
    ctx.lineTo(centerX + 30, h);
    ctx.fill();

    // Head (Skin tone)
    ctx.fillStyle = "#f0d5be";
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, w * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Hair (Black/Dark Brown)
    ctx.fillStyle = "#1f1f1f";
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, w * 0.29, Math.PI, 0); // Top half
    ctx.lineTo(centerX + w * 0.29, centerY - 20);
    ctx.quadraticCurveTo(centerX, centerY - 40, centerX - w * 0.29, centerY - 20);
    ctx.fill();

    // Glasses (Frames)
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    // Left Lens
    ctx.strokeRect(centerX - 50, centerY - 30, 40, 25);
    // Right Lens
    ctx.strokeRect(centerX + 10, centerY - 30, 40, 25);
    // Bridge
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - 17);
    ctx.lineTo(centerX + 10, centerY - 17);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 17, 3, 0, Math.PI * 2);
    ctx.arc(centerX + 30, centerY - 17, 3, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (Animated)
    const mouthY = centerY + 30;
    ctx.fillStyle = "#5c3a3a"; // Mouth interior

    ctx.beginPath();
    // Static upper lip
    ctx.moveTo(centerX - 20, mouthY);
    // Moving lower lip
    ctx.quadraticCurveTo(centerX, mouthY + 5 + jawOffset, centerX + 20, mouthY);
    ctx.fill();

    // Add a note about the missing image
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Preview Mode", centerX, h - 10);
  };

  const drawFrame = (jawOffset: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (useFallback) {
      drawFallbackFace(ctx, w, h, jawOffset);
      return;
    }

    const img = imageRef.current;
    if (!img) return;

    // 1. Draw the Base Face
    ctx.drawImage(img, 0, 0, w, h);

    // 2. Create the "Mouth Hole"
    if (jawOffset > 0) {
      const jawYPixel = h * FACE_CONFIG.jawY;
      const jawWidthPixel = w * FACE_CONFIG.jawWidthScale;
      const jawXPixel = (w - jawWidthPixel) / 2;

      ctx.fillStyle = "#3a1d1d";
      ctx.fillRect(jawXPixel + 10, jawYPixel, jawWidthPixel - 20, jawOffset);
    }

    // 3. Draw the Jaw
    const sourceY = img.height * FACE_CONFIG.jawY;
    const sourceH = img.height * FACE_CONFIG.jawHeight;
    const destY = h * FACE_CONFIG.jawY;
    const destH = h * FACE_CONFIG.jawHeight;

    ctx.save();
    ctx.beginPath();
    const jawX = (w * (1 - FACE_CONFIG.jawWidthScale)) / 2;
    const jawW = w * FACE_CONFIG.jawWidthScale;

    ctx.moveTo(jawX, destY + jawOffset);
    ctx.lineTo(jawX + jawW, destY + jawOffset);
    ctx.quadraticCurveTo(jawX + jawW, h + jawOffset, w / 2, h + jawOffset);
    ctx.quadraticCurveTo(jawX, h + jawOffset, jawX, destY + jawOffset);
    ctx.clip();

    ctx.drawImage(
      img,
      0, sourceY, img.width, sourceH,
      0, destY + jawOffset, w, destH
    );
    ctx.restore();
  };

  return (
    <div className={`relative overflow - hidden rounded - full border - 4 border - slate - 700 shadow - 2xl ${className} `}>
      {/* Fallback / Placeholder if canvas is loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs text-center p-2">
          Loading...
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full object-cover bg-slate-800"
      />
      {/* Green Ring for "Live" status */}
      <div className={`absolute inset - 0 rounded - full border - 4 transition - colors duration - 300 pointer - events - none ${isSpeaking ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-transparent'} `}></div>
    </div>
  );
};

export default LiveAvatar;