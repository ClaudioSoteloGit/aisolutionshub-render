import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { Logo } from '../components/Logo';
import { TextAnimation } from '../components/TextAnimation';
import { CallToAction } from '../components/CallToAction';

export const PromoHighlight = ({ hook, features, cta, config, style, audio }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dynamic timing based on features count
  const LOGO_DURATION = 45; // 1.5s at 30fps
  const HOOK_DURATION = 75; // 2.5s
  const FEATURE_DURATION = 60; // 2s each
  const CTA_DURATION = 90; // 3s
  
  const totalDuration = LOGO_DURATION + HOOK_DURATION + (features?.length || 2) * FEATURE_DURATION + CTA_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Animated Background */}
      <Background style={style} />

      {/* Particle overlay for premium feel */}
      <ParticleOverlay />

      {/* Logo Intro - Scale + Fade */}
      <Sequence from={0} durationInFrames={LOGO_DURATION}>
        <LogoAnimation style={style} />
      </Sequence>

      {/* Hook - Cinematic text reveal */}
      <Sequence from={LOGO_DURATION} durationInFrames={HOOK_DURATION}>
        <HookReveal hook={hook} style={style} />
      </Sequence>

      {/* Features - Card animations */}
      {features && features.map((feature, i) => {
        const fromFrame = LOGO_DURATION + HOOK_DURATION + i * FEATURE_DURATION;
        return (
          <Sequence
            key={i}
            from={fromFrame}
            durationInFrames={FEATURE_DURATION}
          >
            <FeatureCardPremium 
              feature={feature} 
              index={i} 
              style={style}
              config={config}
            />
          </Sequence>
        );
      })}

      {/* CTA - Pulse animation */}
      <Sequence 
        from={LOGO_DURATION + HOOK_DURATION + (features?.length || 2) * FEATURE_DURATION} 
        durationInFrames={CTA_DURATION}
      >
        <CallToActionPremium text={cta?.text} url={cta?.url} style={style} />
      </Sequence>

      {/* Audio narration if enabled */}
      {audio?.enabled && audio?.src && (
        <Audio src={audio.src} startFrom={0} />
      )}
    </AbsoluteFill>
  );
};

// Premium Logo Animation
const LogoAnimation = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 200, mass: 0.5 }
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        transform: `scale(${scale})`,
        opacity,
        textAlign: 'center'
      }}>
        {/* Logo icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 30,
          background: `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 20px',
          boxShadow: `0 20px 60px rgba(99,102,241,0.4)`
        }}>
          <span style={{ fontSize: 56, fontWeight: 'bold', color: '#fff' }}>AI</span>
        </div>
        
        <h1 style={{
          fontSize: 48,
          fontWeight: '800',
          color: '#ffffff',
          margin: '0 0 8px',
          letterSpacing: '-0.02em'
        }}>
          AISolutionsHub
        </h1>
        
        <p style={{
          fontSize: 20,
          color: '#94a3b8',
          margin: 0,
          fontWeight: '500'
        }}>
          Your AI Automation Partner
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Hook with cinematic text reveal
const HookReveal = ({ hook, style }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 10], [0.95, 1], { extrapolateRight: 'clamp' });

  // Word-by-word animation
  const words = hook.split(' ');
  
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
          height: 4,
          background: `linear-gradient(90deg, ${style.primaryColor}, ${style.secondaryColor})`,
          borderRadius: 2,
          margin: '0 auto 24px'
        }} />
        
        <h2 style={{
          fontSize: 42,
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: 1.2,
          margin: 0,
          letterSpacing: '-0.02em'
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
                marginRight: '0.25em'
              }}>
                {word}
              </span>
            );
          })}
        </h2>
        
        {/* Subtitle */}
        <p style={{
          fontSize: 18,
          color: '#94a3b8',
          marginTop: 16,
          fontWeight: '500'
        }}>
          Discover the future of automation
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Premium Feature Card
const FeatureCardPremium = ({ feature, index, style, config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200 }
  });

  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [60, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        width: Math.min(width - 80, 640),
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '40px 32px',
        border: `1px solid rgba(99,102,241,0.2)`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.1)`,
        textAlign: 'center'
      }}>
        {/* Feature icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${style.primaryColor}20, ${style.secondaryColor}20)`,
          border: `2px solid ${style.primaryColor}40`,
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
          fontSize: 32,
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 12px',
          letterSpacing: '-0.01em'
        }}>
          {feature.title}
        </h3>
        
        {/* Feature description */}
        <p style={{
          fontSize: 18,
          color: '#94a3b8',
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
          background: 'rgba(99,102,241,0.2)',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(frame / 60) * 100}%`,
            background: `linear-gradient(90deg, ${style.primaryColor}, ${style.secondaryColor})`,
            borderRadius: 2,
            transition: 'width 0.1s linear'
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Premium CTA
const CallToActionPremium = ({ text, url, style }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200 }
  });

  const pulse = 1 + Math.sin(frame * 0.15) * 0.02;

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
          color: '#ffffff',
          margin: '0 0 12px'
        }}>
          Ready to transform your business?
        </h3>
        
        <p style={{
          fontSize: 18,
          color: '#94a3b8',
          margin: '0 0 32px'
        }}>
          Join thousands of businesses already using AI
        </p>
        
        {/* CTA Button */}
        <div style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
          borderRadius: 12,
          boxShadow: `0 10px 30px rgba(99,102,241,0.4)`,
          marginBottom: 16
        }}>
          <span style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#ffffff'
          }}>
            {text || 'Start Free'}
          </span>
        </div>
        
        <p style={{
          fontSize: 16,
          color: '#64748b',
          margin: 0
        }}>
          {url || 'aisolutionshub.org'}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Particle overlay for premium feel
const ParticleOverlay = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  // Generate static particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map(p => {
        const y = (p.y + frame * p.speed) % height;
        return (
          <div key={p.id} style={{
            position: 'absolute',
            left: p.x,
            top: y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#6366f1',
            opacity: p.opacity
          }} />
        );
      })}
    </AbsoluteFill>
  );
};