/**
 * AISOLUTIONSHUBVIDEOS - Motion Graphics Video Engine
 * Safe zones + Kinetic typography + Organic animations
 * Based on 2026 platform specs
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Audio,
  OffthreadVideo
} from 'remotion';
import { Series } from '@remotion/transitions';
import { slide, fade, zoomIn, wipe, none } from '@remotion/transitions';
import { applyMotionBlur } from '@remotion/motion-blur';

// ===== SAFE ZONES 2026 =====
// Based on platform UI overlays (TikTok, IG Reels, YouTube Shorts)
const SAFE_ZONES = {
  tiktok: {
    // 1080x1920 base, scaled to composition
    top: 0.12,      // 12% from top (avoid profile UI)
    bottom: 0.22,   // 22% from bottom (avoid caption + buttons)
    left: 0.08,     // 8% from left (avoid like/comment buttons)
    right: 0.08,    // 8% from right
    caption: { bottom: 0.28, height: 0.08 } // Caption area
  },
  instagram: {
    top: 0.08,      // 8% from top (avoid header)
    bottom: 0.20,   // 20% from bottom (avoid caption + reel info)
    left: 0.06,
    right: 0.06,
    caption: { bottom: 0.24, height: 0.06 }
  },
  youtube: {
    top: 0.06,
    bottom: 0.15,   // Less UI at bottom than TikTok
    left: 0.06,
    right: 0.06,
    caption: { bottom: 0.18, height: 0.05 }
  },
  linkedin: {
    top: 0.06,
    bottom: 0.12,   // Minimal UI
    left: 0.06,
    right: 0.06,
    caption: { bottom: 0.15, height: 0.04 }
  },
  twitter: {
    top: 0.06,
    bottom: 0.12,
    left: 0.06,
    right: 0.06,
    caption: { bottom: 0.15, height: 0.04 }
  }
};

// ===== VISUAL STYLE DEFINITIONS =====
const VISUAL_STYLES = {
  corporate: {
    name: 'Corporate',
    colors: {
      bg: '#0f172a',
      bgGradient: '#1e3a5f',
      primary: '#1a56db',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#ffffff',
      muted: '#94a3b8',
      cardBg: 'rgba(30, 58, 95, 0.6)',
      cardBorder: 'rgba(59, 130, 246, 0.3)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '700' },
    transitions: 'slide',
    bgType: 'gradient-dots',
    animationStyle: 'professional'
  },
  dynamic: {
    name: 'Dynamic',
    colors: {
      bg: '#1e0533',
      bgGradient: '#581c87',
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#f59e0b',
      text: '#ffffff',
      muted: '#c4b5fd',
      cardBg: 'rgba(88, 28, 135, 0.5)',
      cardBorder: 'rgba(124, 58, 237, 0.3)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '800' },
    transitions: 'zoom',
    bgType: 'floating-shapes',
    animationStyle: 'energetic'
  },
  minimal: {
    name: 'Minimal',
    colors: {
      bg: '#fafafa',
      bgGradient: '#f5f5f5',
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      text: '#000000',
      muted: '#666666',
      cardBg: '#ffffff',
      cardBorder: '#e5e7eb'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '600' },
    transitions: 'fade',
    bgType: 'clean-lines',
    animationStyle: 'elegant'
  },
  tech: {
    name: 'Tech',
    colors: {
      bg: '#0a0a0a',
      bgGradient: '#111827',
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      text: '#ffffff',
      muted: '#6ee7b7',
      cardBg: 'rgba(17, 24, 39, 0.8)',
      cardBorder: 'rgba(16, 185, 129, 0.3)'
    },
    typography: { fontFamily: 'Inter, monospace', fontWeight: '700' },
    transitions: 'wipe',
    bgType: 'grid-circuit',
    animationStyle: 'futuristic'
  },
  bold: {
    name: 'Bold',
    colors: {
      bg: '#000000',
      bgGradient: '#1a0000',
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#eab308',
      text: '#ffffff',
      muted: '#fca5a5',
      cardBg: 'rgba(0, 0, 0, 0.7)',
      cardBorder: 'rgba(239, 68, 68, 0.4)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '900' },
    transitions: 'zoom',
    bgType: 'color-blocks',
    animationStyle: 'aggressive'
  }
};

// ===== ANIMATED BACKGROUND COMPONENTS =====

// Gradient + Dot Pattern (Corporate)
const CorporateBackground = ({ colors, width, height, frame }) => {
  const t = frame / 360;
  const shiftX = Math.sin(t * Math.PI) * 50;
  const shiftY = Math.cos(t * Math.PI * 0.7) * 30;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Base gradient */}
      <AbsoluteFill style={{
        background: `linear-gradient(${135 + Math.sin(t * Math.PI * 2) * 15}deg, ${colors.bg} 0%, ${colors.bgGradient} 50%, ${colors.bg} 100%)`
      }} />
      
      {/* Dot pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        transform: `translate(${shiftX}px, ${shiftY}px)`
      }} />
      
      {/* Accent orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        filter: 'blur(80px)',
        transform: `translate(${Math.sin(t * Math.PI) * 20}px, ${Math.cos(t * Math.PI) * 20}px)`
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} />
    </AbsoluteFill>
  );
};

// Floating Shapes (Dynamic)
const DynamicBackground = ({ colors, width, height, frame }) => {
  const shapes = React.useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      startX: (Math.sin(i * 1.3) * 0.4 + 0.5) * width,
      startY: (Math.cos(i * 0.9) * 0.4 + 0.5) * height,
      size: 20 + (i % 5) * 15,
      speed: 0.2 + (i % 3) * 0.15,
      rotation: i * 24,
      color: [colors.primary, colors.secondary, colors.accent][i % 3],
      type: i % 4
    }));
  }, [width, height, colors]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Base gradient */}
      <AbsoluteFill style={{
        background: `linear-gradient(${135 + Math.sin(frame * 0.01) * 20}deg, ${colors.bg} 0%, ${colors.bgGradient} 40%, #7c2d12 70%, ${colors.bg} 100%)`
      }} />
      
      {/* Floating shapes */}
      {shapes.map(shape => {
        const x = shape.startX + Math.sin(frame * shape.speed * 0.02 + shape.id) * 50;
        const y = shape.startY + Math.cos(frame * shape.speed * 0.015 + shape.id) * 40;
        const rotation = shape.rotation + frame * shape.speed * 0.5;
        const opacity = 0.06 + Math.sin(frame * 0.03 + shape.id) * 0.03;
        
        return (
          <div key={shape.id} style={{
            position: 'absolute',
            left: x - shape.size / 2,
            top: y - shape.size / 2,
            opacity,
            transform: `rotate(${rotation}deg)`
          }}>
            {shape.type === 0 && (
              <div style={{
                width: shape.size,
                height: shape.size,
                borderRadius: '50%',
                background: shape.color
              }} />
            )}
            {shape.type === 1 && (
              <div style={{
                width: shape.size * 1.3,
                height: shape.size,
                borderRadius: 6,
                background: shape.color
              }} />
            )}
            {shape.type === 2 && (
              <div style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`
              }} />
            )}
            {shape.type === 3 && (
              <div style={{
                width: shape.size,
                height: shape.size,
                borderRadius: '30%',
                background: shape.color,
                transform: `rotate(${rotation * 2}deg)`
              }} />
            )}
          </div>
        );
      })}
      
      {/* Gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        filter: 'blur(100px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: 280,
        height: 280,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.secondary}12 0%, transparent 70%)`,
        filter: 'blur(80px)'
      }} />
    </AbsoluteFill>
  );
};

// Clean Lines (Minimal)
const MinimalBackground = ({ colors, width, height, frame }) => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Thin horizontal lines */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        right: '10%',
        height: 1,
        background: colors.primary,
        opacity: 0.15
      }} />
      <div style={{
        position: 'absolute',
        top: '85%',
        left: '10%',
        right: '10%',
        height: 1,
        background: colors.primary,
        opacity: 0.15
      }} />
      
      {/* Subtle circles */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: 200,
        height: 200,
        border: `1px solid ${colors.primary}10`,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: 280,
        height: 280,
        border: `1px solid ${colors.primary}08`,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: 360,
        height: 360,
        border: `1px solid ${colors.primary}05`,
        borderRadius: '50%'
      }} />
    </AbsoluteFill>
  );
};

// Grid + Circuit (Tech)
const TechBackground = ({ colors, width, height, frame }) => {
  const dots = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      x: (i % 10) * (width / 10) + width / 20,
      y: Math.floor(i / 10) * (height / 5) + height / 10,
      pulse: Math.random() * Math.PI * 2
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      {/* Grid */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(${colors.primary}08 1px, transparent 1px),
          linear-gradient(90deg, ${colors.primary}08 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Circuit dots */}
      {dots.map((dot, i) => {
        const opacity = 0.15 + Math.sin(frame * 0.05 + dot.pulse) * 0.15;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: dot.x - 2,
            top: dot.y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: colors.primary,
            opacity
          }} />
        );
      })}
      
      {/* Scan line */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: (frame * 1.5) % height,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${colors.primary}20, transparent)`
      }} />
      
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
        filter: 'blur(80px)'
      }} />
    </AbsoluteFill>
  );
};

// Color Blocks (Bold)
const BoldBackground = ({ colors, width, height, frame }) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: colors.bg }} />
      
      {/* Animated color blocks */}
      {[0, 1, 2, 3].map(i => {
        const bw = width * (0.25 + i * 0.08);
        const bh = height * (0.12 + i * 0.04);
        const x = width * 0.05 + Math.sin(frame * 0.015 + i * 1.5) * 60;
        const y = height * (0.15 + i * 0.2) + Math.cos(frame * 0.012 + i) * 40;
        const rotation = Math.sin(frame * 0.008 + i * 2) * 8;
        const blockColors = [colors.primary, colors.secondary, colors.accent, colors.primary];
        
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x,
            top: y,
            width: bw,
            height: bh,
            background: blockColors[i],
            opacity: 0.08 + Math.sin(frame * 0.02 + i) * 0.04,
            borderRadius: 16,
            transform: `rotate(${rotation}deg)`
          }} />
        );
      })}
      
      {/* Pulse rings */}
      {[0, 1, 2].map(i => {
        const progress = ((frame * 0.015 + i * 0.33) % 1);
        const size = progress * 500;
        const opacity = (1 - progress) * 0.12;
        
        return (
          <div key={`ring-${i}`} style={{
            position: 'absolute',
            left: width / 2 - size / 2,
            top: height / 2 - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            border: `3px solid ${colors.primary}`,
            opacity
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Background selector
const BackgroundByStyle = ({ style, width, height, frame }) => {
  switch (style.bgType) {
    case 'gradient-dots': return <CorporateBackground colors={style.colors} width={width} height={height} frame={frame} />;
    case 'floating-shapes': return <DynamicBackground colors={style.colors} width={width} height={height} frame={frame} />;
    case 'clean-lines': return <MinimalBackground colors={style.colors} width={width} height={height} frame={frame} />;
    case 'grid-circuit': return <TechBackground colors={style.colors} width={width} height={height} frame={frame} />;
    case 'color-blocks': return <BoldBackground colors={style.colors} width={width} height={height} frame={frame} />;
    default: return <DynamicBackground colors={style.colors} width={width} height={height} frame={frame} />;
  }
};

// ===== KINETIC TEXT COMPONENTS =====

// Word-by-word reveal
const KineticText = ({ text, frame, fps, style, fontSize, maxFontSize, color, align = 'center', delay = 0 }) => {
  const words = text.split(' ');
  const wordsPerSecond = style.animationStyle === 'aggressive' ? 6 : style.animationStyle === 'energetic' ? 5 : 4;
  
  return (
    <div style={{ textAlign: align }}>
      {words.map((word, i) => {
        const wordFrame = frame - delay - (i * (fps / wordsPerSecond));
        const opacity = interpolate(wordFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const translateY = interpolate(wordFrame, [0, 8], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const scale = interpolate(wordFrame, [0, 6], [0.8, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity,
            transform: `translateY(${translateY}px) scale(${scale})`,
            marginRight: '0.2em',
            fontSize,
            fontWeight: style.typography.fontWeight,
            fontFamily: style.typography.fontFamily,
            color: color || style.colors.text,
            letterSpacing: style.name === 'minimal' ? '0.05em' : '-0.02em',
            textTransform: style.name === 'minimal' ? 'uppercase' : 'none'
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Counter animation (for stats like "70%")
const AnimatedCounter = ({ value, frame, fps, style, delay = 0, color, fontSize = 64 }) => {
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const currentFrame = frame - delay;
  const duration = 30; // frames to count up
  
  const currentValue = interpolate(currentFrame, [0, duration], [0, numericPart], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp'
  });
  
  const scale = spring({
    frame: currentFrame,
    fps,
    config: { damping: 100, stiffness: 200 }
  });
  
  const opacity = interpolate(currentFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      fontSize,
      fontWeight: '900',
      color: color || style.colors.primary,
      fontFamily: style.typography.fontFamily,
      letterSpacing: '-0.03em'
    }}>
      {Math.floor(currentValue)}{suffix}
    </div>
  );
};

// ===== SCENE COMPONENTS =====

// Scene 1: Logo + Brand Intro
const LogoScene = ({ style, width, height, frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 200, stiffness: 200, mass: 0.5 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const rotation = interpolate(frame, [0, 20], [-8, 0], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: 'clamp' });

  const boxSize = Math.min(width, height) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        opacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        textAlign: 'center'
      }}>
        {/* Logo box */}
        <div style={{
          width: boxSize,
          height: boxSize,
          borderRadius: style.name === 'minimal' ? 0 : boxSize * 0.25,
          background: style.name === 'minimal' ? 'transparent' : `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.secondary})`,
          border: style.name === 'minimal' ? `3px solid ${style.colors.primary}` : 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 20px',
          boxShadow: style.name === 'tech' ? `0 0 40px ${style.colors.primary}40` : `0 20px 60px rgba(0,0,0,0.3)`
        }}>
          <span style={{
            fontSize: boxSize * 0.45,
            fontWeight: '900',
            color: style.name === 'minimal' ? style.colors.primary : '#fff',
            fontFamily: style.name === 'tech' ? 'monospace' : 'inherit'
          }}>AI</span>
        </div>
        
        {/* Brand name */}
        <h1 style={{
          fontSize: Math.min(width, height) * 0.06,
          fontWeight: '900',
          color: style.colors.text,
          margin: '0 0 8px',
          letterSpacing: style.name === 'minimal' ? '0.1em' : '-0.02em',
          textTransform: style.name === 'minimal' ? 'uppercase' : 'none'
        }}>
          AISolutionsHub
        </h1>
        
        {/* Tagline */}
        <p style={{
          fontSize: Math.min(width, height) * 0.025,
          color: style.colors.muted,
          margin: 0,
          fontWeight: '500',
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`
        }}>
          Your AI Automation Partner
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Hook with kinetic text
const HookScene = ({ hook, style, width, height, frame, fps, platform }) => {
  const safeZone = SAFE_ZONES[platform] || SAFE_ZONES.tiktok;
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 10], [0.95, 1], { extrapolateRight: 'clamp' });
  
  // Accent line animation
  const lineWidth = interpolate(frame, [0, 15], [0, 80], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: 'center',
        maxWidth: width * (1 - safeZone.left - safeZone.right)
      }}>
        {/* Accent line */}
        <div style={{
          width: lineWidth,
          height: style.name === 'minimal' ? 1 : 4,
          background: style.name === 'minimal' ? style.colors.primary : `linear-gradient(90deg, ${style.colors.primary}, ${style.colors.secondary})`,
          borderRadius: 2,
          margin: '0 auto 24px'
        }} />
        
        {/* Hook text */}
        <KineticText
          text={hook}
          frame={frame}
          fps={fps}
          style={style}
          fontSize={Math.min(width, height) * 0.055}
          color={style.colors.text}
        />
        
        {/* Subtitle */}
        <p style={{
          fontSize: Math.min(width, height) * 0.022,
          color: style.colors.muted,
          marginTop: 16,
          fontWeight: '500',
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          Discover the future of automation
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Feature Card with stat badge
const FeatureScene = ({ feature, index, style, width, height, frame, fps, platform }) => {
  const safeZone = SAFE_ZONES[platform] || SAFE_ZONES.tiktok;
  
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [60, 0], { extrapolateRight: 'clamp' });
  
  const cardWidth = Math.min(width * 0.85, 600);
  const cardHeight = Math.min(height * 0.35, 300);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        width: cardWidth,
        textAlign: 'center'
      }}>
        {/* Card */}
        <div style={{
          background: style.colors.cardBg,
          backdropFilter: style.name === 'minimal' ? 'none' : 'blur(20px)',
          borderRadius: style.name === 'minimal' ? 0 : 24,
          padding: '32px 28px',
          border: `1px solid ${style.colors.cardBorder}`,
          boxShadow: style.name === 'tech' ? `0 0 30px ${style.colors.primary}20` : `0 20px 60px rgba(0,0,0,0.3)`
        }}>
          {/* Icon */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: style.name === 'minimal' ? 0 : 18,
            background: style.name === 'minimal' ? `${style.colors.primary}08` : `${style.colors.primary}20`,
            border: `2px solid ${style.colors.primary}40`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 16px',
            fontSize: 36
          }}>
            {feature.icon || '✨'}
          </div>
          
          {/* Title */}
          <h3 style={{
            fontSize: Math.min(width, height) * 0.04,
            fontWeight: '800',
            color: style.colors.text,
            margin: '0 0 10px',
            letterSpacing: style.name === 'minimal' ? '0.05em' : '-0.01em',
            textTransform: style.name === 'minimal' ? 'uppercase' : 'none'
          }}>
            {feature.title}
          </h3>
          
          {/* Description */}
          <p style={{
            fontSize: Math.min(width, height) * 0.022,
            color: style.colors.muted,
            margin: 0,
            lineHeight: 1.5,
            fontWeight: '400'
          }}>
            {feature.desc}
          </p>
          
          {/* Progress bar */}
          <div style={{
            marginTop: 20,
            height: 3,
            background: `${style.colors.primary}20`,
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(frame / 60) * 100}%`,
              background: `linear-gradient(90deg, ${style.colors.primary}, ${style.colors.secondary})`,
              borderRadius: 2
            }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA with pulse
const CTAScene = ({ cta, style, width, height, frame, fps, platform }) => {
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.02;

  const btnWidth = Math.min(width * 0.6, 320);
  const btnHeight = 64;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `scale(${scale * pulse})`,
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: Math.min(width, height) * 0.045,
          fontWeight: '800',
          color: style.colors.text,
          margin: '0 0 12px',
          textTransform: style.name === 'minimal' ? 'uppercase' : 'none',
          letterSpacing: style.name === 'minimal' ? '0.05em' : 'normal'
        }}>
          Ready to transform your business?
        </h3>
        
        <p style={{
          fontSize: Math.min(width, height) * 0.022,
          color: style.colors.muted,
          margin: '0 0 32px'
        }}>
          Join thousands of businesses already using AI
        </p>
        
        {/* CTA Button */}
        <div style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: style.name === 'minimal' ? style.colors.primary : `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.secondary})`,
          borderRadius: style.name === 'minimal' ? 0 : 14,
          border: style.name === 'minimal' ? `2px solid ${style.colors.primary}` : 'none',
          boxShadow: style.name === 'tech' ? `0 0 30px ${style.colors.primary}40` : `0 10px 30px rgba(0,0,0,0.3)`,
          marginBottom: 16
        }}>
          <span style={{
            fontSize: Math.min(width, height) * 0.028,
            fontWeight: '800',
            color: '#ffffff'
          }}>
            {cta?.text || 'Start Free'}
          </span>
        </div>
        
        <p style={{
          fontSize: Math.min(width, height) * 0.02,
          color: style.name === 'minimal' ? '#999' : '#64748b',
          margin: 0
        }}>
          {cta?.url || 'aisolutionshub.org'}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== MAIN COMPOSITION =====
export const PromoHighlight = ({ hook, features, cta, config, style, audio, visualStyle }) => {
  const { fps, width, height } = useVideoConfig();
  
  const styleName = visualStyle || 'dynamic';
  const styleConfig = { ...VISUAL_STYLES[styleName], ...style };
  const platform = config?.platform || 'tiktok';
  
  // Dynamic timing
  const LOGO_DURATION = 45;    // 1.5s
  const HOOK_DURATION = 75;    // 2.5s
  const FEATURE_DURATION = 60; // 2s each
  const CTA_DURATION = 90;     // 3s

  return (
    <AbsoluteFill style={{ backgroundColor: styleConfig.colors.bg, overflow: 'hidden' }}>
      {/* Animated Background */}
      <BackgroundByStyle style={styleConfig} width={width} height={height} frame={useCurrentFrame()} />

      {/* Logo Intro */}
      <Sequence from={0} durationInFrames={LOGO_DURATION} name="logo">
        <LogoScene style={styleConfig} width={width} height={height} frame={useCurrentFrame()} fps={fps} />
      </Sequence>

      {/* Hook */}
      <Sequence from={LOGO_DURATION} durationInFrames={HOOK_DURATION} name="hook">
        <HookScene 
          hook={hook} 
          style={styleConfig} 
          width={width} 
          height={height} 
          frame={useCurrentFrame()} 
          fps={fps}
          platform={platform}
        />
      </Sequence>

      {/* Features */}
      {features && features.map((feature, i) => {
        const fromFrame = LOGO_DURATION + HOOK_DURATION + i * FEATURE_DURATION;
        return (
          <Sequence
            key={i}
            from={fromFrame}
            durationInFrames={FEATURE_DURATION}
            name={`feature-${i}`}
          >
            <FeatureScene 
              feature={feature} 
              index={i} 
              style={styleConfig}
              width={width}
              height={height}
              frame={useCurrentFrame()}
              fps={fps}
              platform={platform}
            />
          </Sequence>
        );
      })}

      {/* CTA */}
      <Sequence 
        from={LOGO_DURATION + HOOK_DURATION + (features?.length || 2) * FEATURE_DURATION} 
        durationInFrames={CTA_DURATION}
        name="cta"
      >
        <CTAScene 
          cta={cta} 
          style={styleConfig} 
          width={width} 
          height={height} 
          frame={useCurrentFrame()} 
          fps={fps}
          platform={platform}
        />
      </Sequence>

      {/* Audio */}
      {audio?.enabled && audio?.src && (
        <Audio src={audio.src} startFrom={0} />
      )}
    </AbsoluteFill>
  );
};
