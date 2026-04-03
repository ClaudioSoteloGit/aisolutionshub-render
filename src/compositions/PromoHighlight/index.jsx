import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, OffthreadVideo, Img } from 'remotion';
import { Series } from '@remotion/transitions';
import { slide, fade, zoomIn, wipe } from '@remotion/transitions';
import { RoundedCorner, Circle } from '@remotion/shapes';
import { applyMotionBlur } from '@remotion/motion-blur';

// ===== STYLE CONFIGURATIONS =====
const VISUAL_STYLES = {
  corporate: {
    name: 'Corporate',
    description: 'Professional with stock footage backgrounds',
    bgType: 'video',
    colors: { primary: '#1a56db', secondary: '#1e40af', accent: '#3b82f6', text: '#ffffff', muted: '#94a3b8' },
    typography: 'bold, clean, executive',
    transitions: 'slide',
    elements: ['overlay', 'badge', 'progress-bar', 'logo-watermark']
  },
  dynamic: {
    name: 'Dynamic',
    description: 'Animated shapes, vibrant gradients, energetic',
    bgType: 'gradient-shapes',
    colors: { primary: '#7c3aed', secondary: '#ec4899', accent: '#f59e0b', text: '#ffffff', muted: '#c4b5fd' },
    typography: 'kinetic, bold, playful',
    transitions: 'zoom',
    elements: ['floating-shapes', 'particles', 'gradient-orbs', 'wave-divider']
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean white/black, typography-focused, elegant',
    bgType: 'solid',
    colors: { primary: '#000000', secondary: '#333333', accent: '#666666', text: '#000000', muted: '#666666' },
    typography: 'large, serif, editorial',
    transitions: 'fade',
    elements: ['thin-lines', 'subtle-geometry', 'typography-only']
  },
  tech: {
    name: 'Tech',
    description: 'Grid patterns, code elements, futuristic',
    bgType: 'grid-pattern',
    colors: { primary: '#10b981', secondary: '#06b6d4', accent: '#8b5cf6', text: '#ffffff', muted: '#6ee7b7' },
    typography: 'monospace, futuristic',
    transitions: 'wipe',
    elements: ['grid-lines', 'circuit-paths', 'data-dots', 'scan-line']
  },
  bold: {
    name: 'Bold',
    description: 'Vibrant colors, kinetic typography, viral-ready',
    bgType: 'color-blocks',
    colors: { primary: '#ef4444', secondary: '#f97316', accent: '#eab308', text: '#ffffff', muted: '#fca5a5' },
    typography: 'ultra-bold, oversized, attention-grabbing',
    transitions: 'zoom',
    elements: ['color-blocks', 'emoji-burst', 'counter-animation', 'pulse-rings']
  }
};

// ===== BACKGROUND COMPONENTS =====

// Corporate: Video overlay background
const CorporateBackground = ({ style }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 0.6], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill>
      {/* Dark gradient base */}
      <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c1929 100%)' }} />
      
      {/* Subtle pattern overlay */}
      <AbsoluteFill style={{ 
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      
      {/* Accent gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '50%',
        height: '60%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${style.primary}15 0%, transparent 70%)`,
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '40%',
        height: '50%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${style.secondary}10 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} />
    </AbsoluteFill>
  );
};

// Dynamic: Animated shapes + gradients
const DynamicBackground = ({ style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  const shapes = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 1.3) * 0.4 + 0.5) * width,
      y: (Math.cos(i * 0.9) * 0.4 + 0.5) * height,
      size: 30 + (i % 4) * 25,
      rotation: i * 30,
      speed: 0.3 + (i % 3) * 0.2,
      color: [style.primary, style.secondary, style.accent][i % 3],
      type: i % 3
    }));
  }, [width, height, style]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Base gradient */}
      <AbsoluteFill style={{ 
        background: `linear-gradient(135deg, #1e0533 0%, #3b0764 30%, #581c87 60%, #1e0533 100%)`
      }} />
      
      {/* Animated shapes */}
      {shapes.map(shape => {
        const x = shape.x + Math.sin(frame * shape.speed * 0.02 + shape.id) * 40;
        const y = shape.y + Math.cos(frame * shape.speed * 0.015 + shape.id) * 30;
        const rotation = shape.rotation + frame * shape.speed * 0.5;
        const opacity = 0.08 + Math.sin(frame * 0.03 + shape.id) * 0.04;
        
        return (
          <div key={shape.id} style={{
            position: 'absolute',
            left: x,
            top: y,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            opacity
          }}>
            {shape.type === 0 && (
              <Circle radius={shape.size} fill={shape.color} />
            )}
            {shape.type === 1 && (
              <RoundedCorner width={shape.size * 1.5} height={shape.size * 1.5} cornerRadius={8} fill={shape.color} />
            )}
            {shape.type === 2 && (
              <div style={{
                width: shape.size,
                height: shape.size,
                background: shape.color,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }} />
            )}
          </div>
        );
      })}
      
      {/* Gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${style.primary}20 0%, transparent 70%)`,
        filter: 'blur(100px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${style.secondary}15 0%, transparent 70%)`,
        filter: 'blur(80px)'
      }} />
    </AbsoluteFill>
  );
};

// Minimal: Clean solid with subtle lines
const MinimalBackground = ({ style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: '#fafafa' }}>
      {/* Thin accent line */}
      <div style={{
        position: 'absolute',
        top: height * 0.15,
        left: width * 0.1,
        right: width * 0.1,
        height: 1,
        background: style.primary,
        opacity: 0.2
      }} />
      
      {/* Subtle geometric element */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: 200,
        height: 200,
        border: `1px solid ${style.primary}15`,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        transform: 'translateY(-50%)',
        width: 280,
        height: 280,
        border: `1px solid ${style.primary}08`,
        borderRadius: '50%'
      }} />
    </AbsoluteFill>
  );
};

// Tech: Grid + circuit patterns
const TechBackground = ({ style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  const dots = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      x: (i % 8) * (width / 8) + width / 16,
      y: Math.floor(i / 8) * (height / 5) + height / 10,
      pulse: Math.random() * Math.PI * 2
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: '#0a0a0a', overflow: 'hidden' }}>
      {/* Grid lines */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Data dots */}
      {dots.map((dot, i) => {
        const opacity = 0.2 + Math.sin(frame * 0.05 + dot.pulse) * 0.2;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: dot.x - 2,
            top: dot.y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: style.primary,
            opacity
          }} />
        );
      })}
      
      {/* Scan line */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: (frame * 2) % height,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${style.primary}30, transparent)`
      }} />
      
      {/* Glow orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${style.primary}10 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} />
    </AbsoluteFill>
  );
};

// Bold: Color blocks + kinetic
const BoldBackground = ({ style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Base */}
      <AbsoluteFill style={{ background: '#000000' }} />
      
      {/* Animated color blocks */}
      {[0, 1, 2].map(i => {
        const blockWidth = width * (0.3 + i * 0.1);
        const blockHeight = height * (0.15 + i * 0.05);
        const x = width * 0.1 + Math.sin(frame * 0.02 + i) * 50;
        const y = height * (0.2 + i * 0.25) + Math.cos(frame * 0.015 + i) * 30;
        const rotation = Math.sin(frame * 0.01 + i * 2) * 5;
        const colors = [style.primary, style.secondary, style.accent];
        
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x,
            top: y,
            width: blockWidth,
            height: blockHeight,
            background: colors[i],
            opacity: 0.12,
            borderRadius: 20,
            transform: `rotate(${rotation}deg)`
          }} />
        );
      })}
      
      {/* Pulse rings */}
      {[0, 1, 2].map(i => {
        const progress = ((frame * 0.02 + i * 0.33) % 1);
        const size = progress * 400;
        const opacity = (1 - progress) * 0.15;
        
        return (
          <div key={`ring-${i}`} style={{
            position: 'absolute',
            left: width / 2 - size / 2,
            top: height / 2 - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            border: `2px solid ${style.primary}`,
            opacity
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===== BACKGROUND SELECTOR =====
const BackgroundByStyle = ({ styleName, style }) => {
  switch (styleName) {
    case 'corporate': return <CorporateBackground style={style} />;
    case 'dynamic': return <DynamicBackground style={style} />;
    case 'minimal': return <MinimalBackground style={style} />;
    case 'tech': return <TechBackground style={style} />;
    case 'bold': return <BoldBackground style={style} />;
    default: return <DynamicBackground style={style} />;
  }
};

// ===== TRANSITION SELECTOR =====
const getTransition = (styleName) => {
  switch (styleName) {
    case 'corporate': return slide({ direction: 'from-right' });
    case 'dynamic': return zoomIn();
    case 'minimal': return fade();
    case 'tech': return wipe({ direction: 'from-left' });
    case 'bold': return zoomIn();
    default: return fade();
  }
};

// ===== ANIMATED STAT BADGE =====
const StatBadge = ({ value, label, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  
  // Animate number counting
  const numericValue = parseInt(value);
  const displayValue = isNaN(numericValue) ? value : Math.floor(interpolate(frame, [0, 30], [0, numericValue], { extrapolateRight: 'clamp' }));

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 24px',
      background: `${style.primary}15`,
      border: `1px solid ${style.primary}30`,
      borderRadius: 12,
      marginRight: 12
    }}>
      <span style={{
        fontSize: 32,
        fontWeight: '800',
        color: style.primary
      }}>
        {isNaN(numericValue) ? value : `${displayValue}${value.includes('%') ? '%' : value.includes('/') ? '' : ''}`}
      </span>
      <span style={{
        fontSize: 12,
        color: style.muted,
        fontWeight: '500',
        marginTop: 2
      }}>
        {label}
      </span>
    </div>
  );
};

// ===== MAIN COMPOSITION =====
export const PromoHighlight = ({ hook, features, cta, config, style, audio, visualStyle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const styleName = visualStyle || 'dynamic';
  const styleConfig = { ...VISUAL_STYLES[styleName], ...style };
  
  // Dynamic timing
  const LOGO_DURATION = 45;
  const HOOK_DURATION = 75;
  const FEATURE_DURATION = 60;
  const CTA_DURATION = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Background */}
      <BackgroundByStyle styleName={styleName} style={styleConfig} />

      {/* Logo Intro */}
      <Sequence from={0} durationInFrames={LOGO_DURATION} name="logo">
        <LogoAnimation style={styleConfig} styleName={styleName} />
      </Sequence>

      {/* Hook */}
      <Sequence from={LOGO_DURATION} durationInFrames={HOOK_DURATION} name="hook">
        <HookReveal hook={hook} style={styleConfig} styleName={styleName} />
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
            <FeatureCardPremium 
              feature={feature} 
              index={i} 
              style={styleConfig}
              styleName={styleName}
              config={config}
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
        <CallToActionPremium text={cta?.text} url={cta?.url} style={styleConfig} styleName={styleName} />
      </Sequence>

      {/* Audio */}
      {audio?.enabled && audio?.src && (
        <Audio src={audio.src} startFrom={0} />
      )}
    </AbsoluteFill>
  );
};

// ===== LOGO ANIMATION =====
const LogoAnimation = ({ style, styleName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200, stiffness: 200, mass: 0.5 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const rotation = interpolate(frame, [0, 20], [-10, 0], { extrapolateRight: 'clamp' });

  const isMinimal = styleName === 'minimal';
  const isTech = styleName === 'tech';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        textAlign: 'center'
      }}>
        {/* Logo icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: isMinimal ? 0 : 30,
          background: isMinimal 
            ? 'transparent' 
            : `linear-gradient(135deg, ${style.primary}, ${style.secondary})`,
          border: isMinimal ? `3px solid ${style.primary}` : 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 20px',
          boxShadow: isTech ? `0 0 40px ${style.primary}40` : `0 20px 60px rgba(99,102,241,0.4)`
        }}>
          <span style={{ 
            fontSize: 56, 
            fontWeight: 'bold', 
            color: isMinimal ? style.primary : '#fff',
            fontFamily: isTech ? 'monospace' : 'inherit'
          }}>AI</span>
        </div>
        
        <h1 style={{
          fontSize: 48,
          fontWeight: '800',
          color: isMinimal ? '#000' : '#ffffff',
          margin: '0 0 8px',
          letterSpacing: isMinimal ? '0.1em' : '-0.02em',
          textTransform: isMinimal ? 'uppercase' : 'none'
        }}>
          AISolutionsHub
        </h1>
        
        <p style={{
          fontSize: 20,
          color: isMinimal ? '#666' : '#94a3b8',
          margin: 0,
          fontWeight: '500'
        }}>
          Your AI Automation Partner
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== HOOK REVEAL =====
const HookReveal = ({ hook, style, styleName }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 10], [0.95, 1], { extrapolateRight: 'clamp' });

  const words = hook.split(' ');
  const isMinimal = styleName === 'minimal';
  const isBold = styleName === 'bold';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        textAlign: 'center',
        maxWidth: width - 80
      }}>
        {/* Accent line */}
        <div style={{
          width: 60,
          height: styleName === 'minimal' ? 1 : 4,
          background: isMinimal ? style.primary : `linear-gradient(90deg, ${style.primary}, ${style.secondary})`,
          borderRadius: 2,
          margin: '0 auto 24px'
        }} />
        
        <h2 style={{
          fontSize: isBold ? 56 : 42,
          fontWeight: isBold ? '900' : '800',
          color: isMinimal ? '#000' : '#ffffff',
          lineHeight: 1.2,
          margin: 0,
          letterSpacing: isMinimal ? '0.05em' : '-0.02em',
          textTransform: isMinimal ? 'uppercase' : 'none'
        }}>
          {words.map((word, i) => {
            const wordFrame = frame - i * 3;
            const wordOpacity = interpolate(wordFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            const wordY = interpolate(wordFrame, [0, 8], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            
            return (
              <span key={i} style={{
                display: 'inline-block',
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                marginRight: '0.25em',
                background: isBold ? `linear-gradient(135deg, ${style.primary}, ${style.secondary})` : 'none',
                WebkitBackgroundClip: isBold ? 'text' : 'none',
                WebkitTextFillColor: isBold ? 'transparent' : 'inherit',
                padding: isBold ? '0 4px' : 0
              }}>
                {word}
              </span>
            );
          })}
        </h2>
        
        <p style={{
          fontSize: 18,
          color: isMinimal ? '#666' : '#94a3b8',
          marginTop: 16,
          fontWeight: '500'
        }}>
          Discover the future of automation
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== FEATURE CARD =====
const FeatureCardPremium = ({ feature, index, style, styleName, config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [60, 0], { extrapolateRight: 'clamp' });

  const isMinimal = styleName === 'minimal';
  const isTech = styleName === 'tech';
  const isBold = styleName === 'bold';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        width: Math.min(width - 80, 640),
        background: isMinimal ? '#ffffff' : 'rgba(30, 41, 59, 0.8)',
        backdropFilter: isMinimal ? 'none' : 'blur(20px)',
        borderRadius: isMinimal ? 0 : 24,
        padding: '40px 32px',
        border: isMinimal 
          ? `2px solid ${style.primary}` 
          : `1px solid ${style.primary}20`,
        boxShadow: isTech 
          ? `0 0 30px ${style.primary}20, inset 0 0 30px ${style.primary}05`
          : isMinimal 
            ? 'none'
            : `0 20px 60px rgba(0,0,0,0.3)`,
        textAlign: 'center'
      }}>
        {/* Feature icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: isMinimal ? 0 : 20,
          background: isMinimal ? `${style.primary}08` : `${style.primary}20`,
          border: `2px solid ${style.primary}40`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 20px',
          fontSize: 40
        }}>
          {feature.icon || '✨'}
        </div>
        
        {/* Feature title */}
        <h3 style={{
          fontSize: isBold ? 36 : 32,
          fontWeight: isBold ? '900' : '700',
          color: isMinimal ? '#000' : '#ffffff',
          margin: '0 0 12px',
          letterSpacing: isMinimal ? '0.05em' : '-0.01em',
          textTransform: isMinimal ? 'uppercase' : 'none'
        }}>
          {feature.title}
        </h3>
        
        {/* Feature description */}
        <p style={{
          fontSize: 18,
          color: isMinimal ? '#666' : '#94a3b8',
          margin: 0,
          lineHeight: 1.5,
          fontWeight: '400'
        }}>
          {feature.desc}
        </p>
        
        {/* Progress indicator */}
        <div style={{
          marginTop: 24,
          height: 3,
          background: isMinimal ? '#e5e7eb' : `${style.primary}20`,
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(frame / 60) * 100}%`,
            background: isBold 
              ? `linear-gradient(90deg, ${style.primary}, ${style.secondary}, ${style.accent})`
              : `linear-gradient(90deg, ${style.primary}, ${style.secondary})`,
            borderRadius: 2
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===== CTA =====
const CallToActionPremium = ({ text, url, style, styleName }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.02;

  const isMinimal = styleName === 'minimal';
  const isBold = styleName === 'bold';
  const isTech = styleName === 'tech';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `scale(${scale * pulse})`,
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: 36,
          fontWeight: '700',
          color: isMinimal ? '#000' : '#ffffff',
          margin: '0 0 12px',
          textTransform: isMinimal ? 'uppercase' : 'none',
          letterSpacing: isMinimal ? '0.05em' : 'normal'
        }}>
          Ready to transform your business?
        </h3>
        
        <p style={{
          fontSize: 18,
          color: isMinimal ? '#666' : '#94a3b8',
          margin: '0 0 32px'
        }}>
          Join thousands of businesses already using AI
        </p>
        
        {/* CTA Button */}
        <div style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: isMinimal ? style.primary : `linear-gradient(135deg, ${style.primary}, ${style.secondary})`,
          borderRadius: isMinimal ? 0 : 12,
          border: isMinimal ? `2px solid ${style.primary}` : 'none',
          boxShadow: isTech ? `0 0 30px ${style.primary}40` : isBold ? `0 15px 40px ${style.primary}50` : `0 10px 30px rgba(99,102,241,0.4)`,
          marginBottom: 16
        }}>
          <span style={{
            fontSize: 20,
            fontWeight: '700',
            color: isMinimal ? '#ffffff' : '#ffffff'
          }}>
            {text || 'Start Free'}
          </span>
        </div>
        
        <p style={{
          fontSize: 16,
          color: isMinimal ? '#999' : '#64748b',
          margin: 0
        }}>
          {url || 'aisolutionshub.org'}
        </p>
      </div>
    </AbsoluteFill>
  );
};
