import React from 'react';
import { motion } from 'framer-motion';

export const RoyalKnotAnimation: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto h-72 sm:h-80 flex items-center justify-center overflow-hidden">
      {/* Background Soft Radiant Glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.4, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-champagne-300 via-burgundy-200 to-champagne-400 blur-3xl pointer-events-none"
      />

      {/* SVG Canvas for Fabric Drapes & Knot */}
      <svg
        viewBox="0 0 600 320"
        className="w-full h-full drop-shadow-2xl z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bride Saree Crimson Gradient */}
          <linearGradient id="brideSareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B1D34" />
            <stop offset="50%" stopColor="#801428" />
            <stop offset="100%" stopColor="#4D0E19" />
          </linearGradient>

          {/* Groom Kanduva Gold & Ivory Gradient */}
          <linearGradient id="groomKanduvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="40%" stopColor="#F4EFE3" />
            <stop offset="100%" stopColor="#D4B876" />
          </linearGradient>

          {/* Golden Zari Border Gradient */}
          <linearGradient id="goldZariGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BA9950" />
            <stop offset="50%" stopColor="#FFF3D1" />
            <stop offset="100%" stopColor="#BA9950" />
          </linearGradient>

          {/* Wedding Rings Gold Metallic Gradient */}
          <linearGradient id="ringGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE8A3" />
            <stop offset="50%" stopColor="#D4B876" />
            <stop offset="100%" stopColor="#8E6A21" />
          </linearGradient>
        </defs>

        {/* 1. Bride's Crimson Silk Saree Drape */}
        <motion.path
          d="M 50,260 C 130,230 180,180 250,160 C 310,140 360,190 420,150 C 470,120 520,70 560,50"
          stroke="url(#brideSareeGrad)"
          strokeWidth="28"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        {/* Bride Zari Brocade Trim */}
        <motion.path
          d="M 50,260 C 130,230 180,180 250,160 C 310,140 360,190 420,150 C 470,120 520,70 560,50"
          stroke="url(#goldZariGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
        />

        {/* 2. Groom's Ivory & Gold Kanduva Drape */}
        <motion.path
          d="M 50,60 C 140,90 190,140 260,160 C 330,180 370,120 430,170 C 480,210 520,240 560,270"
          stroke="url(#groomKanduvaGrad)"
          strokeWidth="24"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
        />
        {/* Groom Kanduva Zari Trim */}
        <motion.path
          d="M 50,60 C 140,90 190,140 260,160 C 330,180 370,120 430,170 C 480,210 520,240 560,270"
          stroke="url(#goldZariGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
        />

        {/* 3. The Sacred Intertwined Knot in Center */}
        <motion.path
          d="M 270,140 C 310,110 340,190 300,180 C 260,170 290,130 330,160"
          stroke="url(#goldZariGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, scale: 0.8 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 1.6, ease: "easeOut" }}
        />

        {/* 4. Wedding Ring 1 (Bride's Diamond Solitaire Band) */}
        <motion.ellipse
          cx="285"
          cy="160"
          rx="26"
          ry="32"
          stroke="url(#ringGoldGrad)"
          strokeWidth="6"
          fill="none"
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: -15, opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.3, type: "spring", stiffness: 90 }}
        />
        {/* Solitaire Diamond Sparkle on Ring 1 */}
        <motion.circle
          cx="278"
          cy="130"
          r="4.5"
          fill="#FFFFFF"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.8, delay: 3.1 }}
        />

        {/* 5. Wedding Ring 2 (Groom's Interlocking Platinum/Gold Band) */}
        <motion.ellipse
          cx="315"
          cy="160"
          rx="26"
          ry="32"
          stroke="url(#ringGoldGrad)"
          strokeWidth="6"
          fill="none"
          initial={{ scale: 0, rotate: 45, opacity: 0 }}
          animate={{ scale: 1, rotate: 15, opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.5, type: "spring", stiffness: 90 }}
        />

        {/* Diamond Star Sparkles */}
        <motion.path
          d="M 278,124 L 280,129 L 285,130 L 280,131 L 278,136 L 276,131 L 271,130 L 276,129 Z"
          fill="#FFF3D1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1], scale: [0, 1.2, 0.9, 1] }}
          transition={{ duration: 2, delay: 3.2, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>

      {/* Brand Crown & Title Unveiling */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 3.3 }}
        className="absolute bottom-2 sm:bottom-4 text-center z-20 pointer-events-none"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-champagne-500" />
          <span className="text-champagne-600 tracking-[0.3em] text-xs font-semibold uppercase">
            Ceremonial Union
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-champagne-500" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-burgundy-900 drop-shadow-sm">
          THE ROYAL KNOT
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
          Where Forever Begins in Regal Grandeur
        </p>
      </motion.div>
    </div>
  );
};

