/**
 * AISOLUTIONSHUBVIDEOS - Motion Graphics Video Engine v2
 * Based on Sabrina Ramonov's Remotion best practices 2026
 * 
 * Safe zones: 150px top, 170px bottom, 60px sides
 * Min fonts: Headlines 56px+, body 36px+, labels 28px min
 * Transitions: 12-frame fades between scenes
 * Animations: spring({ damping: 200 }), stagger 8-12 frames
 * Cards: Glass-morphism with backdrop-blur
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Audio
} from 'remotion';
import { TransitionSeries, springTransition } from '@remotion/transitions';
import { fade, slide, zoomIn, wipe } from '@remotion/transitions';

// ===== SAFE ZONES IN PIXELS (Sabrina's specs) =====
// 1080x1920 base, scaled proportionally for any resolution
const SAFE_ZONE_BASE = {
  top: 150,      // Platform search bars, status bar
  bottom: 170,   // Navigation buttons, swipe-up UI
  left: 60,      // Side margins
  right: 60      // Side margins
};

// Scale safe zones to actual composition size
function getSafeZone(width, height) {
  const scale = width / 1080; // Base is 1080px wide
  return {
    top: Math.round(SAFE_ZONE_BASE.top * scale),
    bottom: Math.round(SAFE_ZONE_BASE.bottom * scale),
    left: Math.round(SAFE_ZONE_BASE.left * scale),
    right: Math.round(SAFE_ZONE_BASE.right * scale),
    safeWidth: width - Math.round(SAFE_ZONE_BASE.left * scale) - Math.round(SAFE_ZONE_BASE.right * scale),
    safeHeight: height - Math.round(SAFE_ZONE_BASE.top * scale) - Math.round(SAFE_ZONE_BASE.bottom * scale),
    safeTop: Math.round(SAFE_ZONE_BASE.top * scale),
    safeLeft: Math.round(SAFE_ZONE_BASE.left * scale)
  };
}

// ===== MINIMUM FONT SIZES (Sabrina's specs) =====
const MIN_FONTS = {
  headline: 56,   // Headlines minimum
  body: 36,       // Body/subtitles minimum
  label: 28       // Small text absolute minimum
};

function scaleFontSize(baseSize, width) {
  const scale = width / 1080;
  return Math.max(baseSize, Math.round(baseSize * scale)); // Never below minimum
}

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
      cardBorder: 'rgba(59, 130, 246, 0.3)',
      cardShadow: 'rgba(0, 0, 0, 0.3)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '700' },
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
      cardBorder: 'rgba(124, 58, 237, 0.3)',
      cardShadow: 'rgba(0, 0, 0, 0.3)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '800' },
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
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: '#e5e7eb',
      cardShadow: 'rgba(0, 0, 0, 0.08)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '600' },
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
      cardBorder: 'rgba(16, 185, 129, 0.3)',
      cardShadow: 'rgba(16, 185, 129, 0.2)'
    },
    typography: { fontFamily: 'Inter, monospace', fontWeight: '700' },
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
      cardBorder: 'rgba(239, 68, 68, 0.4)',
      cardShadow: 'rgba(239, 68, 68, 0.3)'
    },
    typography: { fontFamily: 'Inter, sans-serif', fontWeight: '900' },
    bgType: 'color-blocks',
    animationStyle: 'aggressive'
  }
};

// ===== ANIMATED BACKGROUNDS =====

const CorporateBackground = ({ colors, width, height, frame }) => {
  const t = frame / 360;
  const shiftX = Math.sin(t * Math.PI) * 50;
  const shiftY = Math.cos(t * Math.PI * 0.7) * 30;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{
        background: `linear-gradient(${135 + Math.sin(t * Math.PI * 2) * 15}deg, ${colors.bg} 0%, ${colors.bgGradient} 50%, ${colors.bg} 100%)`
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        transform: `translate(${shiftX}px, ${shiftY}px)`
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: '10%', width: 300, height: 300,
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        filter: 'blur(80px)', transform: `translate(${Math.sin(t * Math.PI) * 20}px, ${Math.cos(t * Math.PI) * 20}px)`
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '5%', width: 250, height: 250,
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} />
    </AbsoluteFill>
  );
};

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
      <AbsoluteFill style={{
        background: `linear-gradient(${135 + Math.sin(frame * 0.01) * 20}deg, ${colors.bg} 0%, ${colors.bgGradient} 40%, #7c2d12 70%, ${colors.bg} 100%)`
      }} />
      {shapes.map(shape => {
        const x = shape.startX + Math.sin(frame * shape.speed * 0.02 + shape.id) * 50;
        const y = shape.startY + Math.cos(frame * shape.speed * 0.015 + shape.id) * 40;
        const rotation = shape.rotation + frame * shape.speed * 0.5;
        const opacity = 0.06 + Math.sin(frame * 0.03 + shape.id) * 0.03;
        return (
          <div key={shape.id} style={{
            position: 'absolute', left: x - shape.size / 2, top: y - shape.size / 2,
            opacity, transform: `rotate(${rotation}deg)`
          }}>
            {shape.type === 0 && <div style={{ width: shape.size, height: shape.size, borderRadius: '50%', background: shape.color }} />}
            {shape.type === 1 && <div style={{ width: shape.size * 1.3, height: shape.size, borderRadius: 6, background: shape.color }} />}
            {shape.type === 2 && (
              <div style={{ width: 0, height: 0, borderLeft: `${shape.size / 2}px solid transparent`, borderRight: `${shape.size / 2}px solid transparent`, borderBottom: `${shape.size}px solid ${shape.color}` }} />
            )}
            {shape.type === 3 && <div style={{ width: shape.size, height: shape.size, borderRadius: '30%', background: shape.color, transform: `rotate(${rotation * 2}deg)` }} />}
          </div>
        );
      })}
      <div style={{
        position: 'absolute', top: '15%', left: '20%', width: 350, height: 350,
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`, filter: 'blur(100px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: 280, height: 280,
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}12 0%, transparent 70%)`, filter: 'blur(80px)'
      }} />
    </AbsoluteFill>
  );
};

const MinimalBackground = ({ colors, width, height, frame }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <div style={{ position: 'absolute', top: '15%', left: '10%', right: '10%', height: 1, background: colors.primary, opacity: 0.15 }} />
    <div style={{ position: 'absolute', top: '85%', left: '10%', right: '10%', height: 1, background: colors.primary, opacity: 0.15 }} />
    {[200, 280, 360].map((r, i) => (
      <div key={i} style={{
        position: 'absolute', top: '50%', right: '8%', transform: 'translateY(-50%)',
        width: r, height: r, border: `1px solid ${colors.primary}${['10', '08', '05'][i]}`, borderRadius: '50%'
      }} />
    ))}
  </AbsoluteFill>
);

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
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${colors.primary}08 1px, transparent 1px), linear-gradient(90deg, ${colors.primary}08 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      {dots.map((dot, i) => {
        const opacity = 0.15 + Math.sin(frame * 0.05 + dot.pulse) * 0.15;
        return (
          <div key={i} style={{
            position: 'absolute', left: dot.x - 2, top: dot.y - 2,
            width: 4, height: 4, borderRadius: '50%', background: colors.primary, opacity
          }} />
        );
      })}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: (frame * 1.5) % height, height: 2,
        background: `linear-gradient(90deg, transparent, ${colors.primary}20, transparent)`
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: '10%', width: 250, height: 250,
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`, filter: 'blur(80px)'
      }} />
    </AbsoluteFill>
  );
};

const BoldBackground = ({ colors, width, height, frame }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill style={{ background: colors.bg }} />
    {[0, 1, 2, 3].map(i => {
      const bw = width * (0.25 + i * 0.08);
      const bh = height * (0.12 + i * 0.04);
      const x = width * 0.05 + Math.sin(frame * 0.015 + i * 1.5) * 60;
      const y = height * (0.15 + i * 0.2) + Math.cos(frame * 0.012 + i) * 40;
      const rotation = Math.sin(frame * 0.008 + i * 2) * 8;
      return (
        <div key={i} style={{
          position: 'absolute', left: x, top: y, width: bw, height: bh,
          background: [colors.primary, colors.secondary, colors.accent, colors.primary][i],
          opacity: 0.08 + Math.sin(frame * 0.02 + i) * 0.04,
          borderRadius: 16, transform: `rotate(${rotation}deg)`
        }} />
      );
    })}
    {[0, 1, 2].map(i => {
      const progress = ((frame * 0.015 + i * 0.33) % 1);
      const size = progress * 500;
      const opacity = (1 - progress) * 0.12;
      return (
        <div key={`ring-${i}`} style={{
          position: 'absolute', left: width / 2 - size / 2, top: height / 2 - size / 2,
          width: size, height: size, borderRadius: '50%',
          border: `3px solid ${colors.primary}`, opacity
        }} />
      );
    })}
  </AbsoluteFill>
);

const BackgroundByStyle = ({ style, width, height, frame }) => {
  const props = { colors: style.colors, width, height, frame };
  switch (style.bgType) {
    case 'gradient-dots': return <CorporateBackground {...props} />;
    case 'floating-shapes': return <DynamicBackground {...props} />;
    case 'clean-lines': return <MinimalBackground {...props} />;
    case 'grid-circuit': return <TechBackground {...props} />;
    case 'color-blocks': return <BoldBackground {...props} />;
    default: return <DynamicBackground {...props} />;
  }
};

// ===== REUSABLE ANIMATION COMPONENTS =====

// Count-up with tabular-nums (Sabrina's spec)
const CountUp = ({ value, frame, fps, delay = 0, style, color, fontSize, suffix = '' }) => {
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''));
  const currentFrame = frame - delay;
  const duration = 30;
  
  const currentValue = interpolate(currentFrame, [0, duration], [0, numericPart], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp'
  });
  
  const scale = spring({ frame: currentFrame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(currentFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      fontSize, fontWeight: '900',
      color: color || style.colors.primary,
      fontFamily: style.typography.fontFamily,
      fontVariantNumeric: 'tabular-nums', // Sabrina's spec
      letterSpacing: '-0.03em'
    }}>
      {Math.floor(currentValue)}{suffix}
    </div>
  );
};

// Glass-morphism card (Sabrina's spec)
const GlassCard = ({ children, style, width, height, frame, delay = 0 }) => {
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame - delay, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      opacity, transform: `translateY(${translateY}px) scale(${scale})`,
      background: style.colors.cardBg,
      backdropFilter: style.name === 'minimal' ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: style.name === 'minimal' ? 'none' : 'blur(20px)',
      borderRadius: style.name === 'minimal' ? 0 : 24,
      border: `1px solid ${style.colors.cardBorder}`,
      boxShadow: style.name === 'tech' ? `0 0 30px ${style.colors.cardShadow}` : `0 20px 60px ${style.colors.cardShadow}`,
      padding: '32px 28px',
      width: '100%'
    }}>
      {children}
    </div>
  );
};

// Icon container with stagger
const IconContainer = ({ icon, style, delay = 0, frame }) => {
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      width: 72, height: 72,
      borderRadius: style.name === 'minimal' ? 0 : 18,
      background: style.name === 'minimal' ? `${style.colors.primary}08` : `${style.colors.primary}20`,
      border: `2px solid ${style.colors.primary}40`,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      margin: '0 auto 16px', fontSize: 36
    }}>
      {icon || '✨'}
    </div>
  );
};

// ===== SCENE COMPONENTS =====

// Scene 1: Logo
const LogoScene = ({ style, width, height, frame, fps }) => {
  const sz = getSafeZone(width, height);
  const headlineSize = scaleFontSize(MIN_FONTS.headline * 0.9, width);
  const bodySize = scaleFontSize(MIN_FONTS.body * 0.6, width);
  const labelSize = scaleFontSize(MIN_FONTS.label * 0.7, width);

  const scale = spring({ frame, fps, config: { damping: 200, stiffness: 200, mass: 0.5 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const rotation = interpolate(frame, [0, 20], [-8, 0], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: 'clamp' });

  const boxSize = Math.min(sz.safeWidth, sz.safeHeight) * 0.18;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, transform: `scale(${scale}) rotate(${rotation}deg)`, textAlign: 'center' }}>
        <div style={{
          width: boxSize, height: boxSize,
          borderRadius: style.name === 'minimal' ? 0 : boxSize * 0.25,
          background: style.name === 'minimal' ? 'transparent' : `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.secondary})`,
          border: style.name === 'minimal' ? `3px solid ${style.colors.primary}` : 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '0 auto 20px',
          boxShadow: style.name === 'tech' ? `0 0 40px ${style.colors.primary}40` : `0 20px 60px rgba(0,0,0,0.3)`
        }}>
          <span style={{ fontSize: boxSize * 0.45, fontWeight: '900', color: style.name === 'minimal' ? style.colors.primary : '#fff', fontFamily: style.name === 'tech' ? 'monospace' : 'inherit' }}>AI</span>
        </div>
        <h1 style={{ fontSize: headlineSize, fontWeight: '900', color: style.colors.text, margin: '0 0 8px', letterSpacing: style.name === 'minimal' ? '0.1em' : '-0.02em', textTransform: style.name === 'minimal' ? 'uppercase' : 'none' }}>
          AISolutionsHub
        </h1>
        <p style={{ fontSize: labelSize, color: style.colors.muted, margin: 0, fontWeight: '500', opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}>
          Your AI Automation Partner
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Hook with kinetic text
const HookScene = ({ hook, style, width, height, frame, fps }) => {
  const sz = getSafeZone(width, height);
  const headlineSize = scaleFontSize(MIN_FONTS.headline, width);
  const labelSize = scaleFontSize(MIN_FONTS.label * 0.8, width);

  const words = hook.split(' ');
  const wordsPerSecond = style.animationStyle === 'aggressive' ? 6 : style.animationStyle === 'energetic' ? 5 : 4;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: `0 ${sz.safeLeft}px` }}>
      <div style={{ textAlign: 'center', maxWidth: sz.safeWidth }}>
        {/* Accent line */}
        <div style={{
          width: interpolate(frame, [0, 15], [0, 80], { extrapolateRight: 'clamp' }),
          height: style.name === 'minimal' ? 1 : 4,
          background: style.name === 'minimal' ? style.colors.primary : `linear-gradient(90deg, ${style.colors.primary}, ${style.colors.secondary})`,
          borderRadius: 2, margin: '0 auto 24px'
        }} />
        
        {/* Word-by-word kinetic text */}
        <div style={{ textAlign: 'center' }}>
          {words.map((word, i) => {
            const wordFrame = frame - (i * (fps / wordsPerSecond));
            const opacity = interpolate(wordFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            const translateY = interpolate(wordFrame, [0, 8], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            const scale = interpolate(wordFrame, [0, 6], [0.8, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            
            return (
              <span key={i} style={{
                display: 'inline-block', opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                marginRight: '0.2em', fontSize: headlineSize,
                fontWeight: style.typography.fontWeight,
                fontFamily: style.typography.fontFamily,
                color: style.colors.text,
                letterSpacing: style.name === 'minimal' ? '0.05em' : '-0.02em',
                textTransform: style.name === 'minimal' ? 'uppercase' : 'none'
              }}>
                {word}
              </span>
            );
          })}
        </div>
        
        {/* Subtitle */}
        <p style={{
          fontSize: labelSize, color: style.colors.muted, marginTop: 16, fontWeight: '500',
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          Discover the future of automation
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Feature Card - ICON + SHORT TEXT (no walls of text)
const FeatureScene = ({ feature, index, style, width, height, frame, fps }) => {
  const sz = getSafeZone(width, height);
  const headlineSize = scaleFontSize(MIN_FONTS.headline * 0.7, width);
  const bodySize = scaleFontSize(MIN_FONTS.body, width);

  // Stagger: 8-12 frames between elements (Sabrina's spec)
  const STAGGER = 10;
  const iconDelay = 0;
  const titleDelay = STAGGER;
  const descDelay = STAGGER * 2;
  const barDelay = STAGGER * 3;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: `0 ${sz.safeLeft}px` }}>
      <div style={{ maxWidth: sz.safeWidth, textAlign: 'center' }}>
        <GlassCard style={style} width={sz.safeWidth} height={Math.min(height * 0.35, 300)} frame={frame} delay={0}>
          {/* Icon - stagger 0 */}
          <IconContainer icon={feature.icon} style={style} delay={iconDelay} frame={frame} />
          
          {/* Title - stagger STAGGER */}
          <h3 style={{
            fontSize: headlineSize, fontWeight: '800', color: style.colors.text,
            margin: '0 0 10px',
            opacity: interpolate(frame - titleDelay, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame - titleDelay, [0, 8], [20, 0], { extrapolateRight: 'clamp' })}px)`,
            letterSpacing: style.name === 'minimal' ? '0.05em' : '-0.01em',
            textTransform: style.name === 'minimal' ? 'uppercase' : 'none'
          }}>
            {feature.title}
          </h3>
          
          {/* Description - stagger STAGGER*2 - SHORT, no walls of text */}
          <p style={{
            fontSize: bodySize, color: style.colors.muted, margin: 0, lineHeight: 1.5, fontWeight: '400',
            opacity: interpolate(frame - descDelay, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame - descDelay, [0, 8], [15, 0], { extrapolateRight: 'clamp' })}px)`
          }}>
            {feature.desc}
          </p>
          
          {/* Progress bar - stagger STAGGER*3 */}
          <div style={{
            marginTop: 20, height: 3, background: `${style.colors.primary}20`, borderRadius: 2, overflow: 'hidden',
            opacity: interpolate(frame - barDelay, [0, 6], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            <div style={{
              height: '100%',
              width: `${interpolate(frame - barDelay, [0, 30], [0, 100], { extrapolateRight: 'clamp' })}%`,
              background: `linear-gradient(90deg, ${style.colors.primary}, ${style.colors.secondary})`,
              borderRadius: 2
            }} />
          </div>
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CTAScene = ({ cta, style, width, height, frame, fps }) => {
  const sz = getSafeZone(width, height);
  const headlineSize = scaleFontSize(MIN_FONTS.headline * 0.8, width);
  const bodySize = scaleFontSize(MIN_FONTS.body * 0.6, width);
  const labelSize = scaleFontSize(MIN_FONTS.label, width);

  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.02;

  const btnWidth = Math.min(sz.safeWidth * 0.8, 320);
  const btnHeight = 64;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: `0 ${sz.safeLeft}px` }}>
      <div style={{ opacity, transform: `scale(${scale * pulse})`, textAlign: 'center', maxWidth: sz.safeWidth }}>
        <h3 style={{
          fontSize: headlineSize, fontWeight: '800', color: style.colors.text,
          margin: '0 0 12px',
          textTransform: style.name === 'minimal' ? 'uppercase' : 'none',
          letterSpacing: style.name === 'minimal' ? '0.05em' : 'normal'
        }}>
          Ready to transform your business?
        </h3>
        
        <p style={{ fontSize: bodySize, color: style.colors.muted, margin: '0 0 32px' }}>
          Join thousands of businesses already using AI
        </p>
        
        <div style={{
          display: 'inline-block', padding: '16px 40px',
          background: style.name === 'minimal' ? style.colors.primary : `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.secondary})`,
          borderRadius: style.name === 'minimal' ? 0 : 14,
          border: style.name === 'minimal' ? `2px solid ${style.colors.primary}` : 'none',
          boxShadow: style.name === 'tech' ? `0 0 30px ${style.colors.cardShadow}` : `0 10px 30px rgba(0,0,0,0.3)`,
          marginBottom: 16
        }}>
          <span style={{ fontSize: labelSize, fontWeight: '800', color: '#ffffff' }}>
            {cta?.text || 'Start Free'}
          </span>
        </div>
        
        <p style={{ fontSize: scaleFontSize(MIN_FONTS.label * 0.7, width), color: style.name === 'minimal' ? '#999' : '#64748b', margin: 0 }}>
          {cta?.url || 'aisolutionshub.org'}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== MAIN COMPOSITION WITH TRANSITION SERIES =====
export const PromoHighlight = ({ hook, features, cta, config, style, audio, visualStyle }) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  
  const styleName = visualStyle || 'dynamic';
  const styleConfig = { ...VISUAL_STYLES[styleName], ...style };
  const platform = config?.platform || 'tiktok';
  
  // Scene durations
  const LOGO_DURATION = 45;
  const HOOK_DURATION = 75;
  const FEATURE_DURATION = 60;
  const CTA_DURATION = 90;
  const TRANSITION_DURATION = 12; // Sabrina's spec: 12-frame fades

  return (
    <AbsoluteFill style={{ backgroundColor: styleConfig.colors.bg, overflow: 'hidden' }}>
      {/* Animated Background - always visible */}
      <BackgroundByStyle style={styleConfig} width={width} height={height} frame={frame} />

      {/* TransitionSeries with 12-frame fade transitions */}
      <TransitionSeries style={{ position: 'absolute', inset: 0 }}>
        {/* Logo */}
        <TransitionSeries.Sequence durationInFrames={LOGO_DURATION}>
          <LogoScene style={styleConfig} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION_DURATION} />
        
        {/* Hook */}
        <TransitionSeries.Sequence durationInFrames={HOOK_DURATION}>
          <HookScene hook={hook} style={styleConfig} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION_DURATION} />
        
        {/* Features */}
        {features && features.map((feature, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={FEATURE_DURATION}>
              <FeatureScene feature={feature} index={i} style={styleConfig} width={width} height={height} frame={frame} fps={fps} />
            </TransitionSeries.Sequence>
            {i < features.length - 1 && (
              <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION_DURATION} />
            )}
          </React.Fragment>
        ))}
        
        {/* CTA */}
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION_DURATION} />
        <TransitionSeries.Sequence durationInFrames={CTA_DURATION}>
          <CTAScene cta={cta} style={styleConfig} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Audio */}
      {audio?.enabled && audio?.src && (
        <Audio src={audio.src} startFrom={0} />
      )}
    </AbsoluteFill>
  );
};
