/**
 * CINEMATIC TEMPLATE
 * Dark, dramatic, light leaks, film grain, masked text reveals
 * Professional motion design with varied layouts
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig
} from 'remotion';
import { TransitionSeries, fade } from '@remotion/transitions';

// Film grain overlay
const FilmGrain = ({ opacity = 0.04 }) => {
  const frame = useCurrentFrame();
  const grain = React.useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * opacity
    }));
  }, [frame % 3]); // Regenerate every 3 frames

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}>
      {grain.map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${dot.x}%`,
          top: `${dot.y}%`,
          width: dot.size,
          height: dot.size,
          background: '#ffffff',
          opacity: dot.opacity,
          borderRadius: '50%'
        }} />
      ))}
    </AbsoluteFill>
  );
};

// Light leak effect
const LightLeak = ({ frame, colors }) => {
  const opacity = interpolate(Math.sin(frame * 0.02), [-1, 1], [0, 0.15]);
  const x = interpolate(Math.sin(frame * 0.01), [-1, 1], [-20, 120]);
  
  return (
    <div style={{
      position: 'absolute',
      top: -20,
      right: `${x}%`,
      width: 300,
      height: 400,
      background: `radial-gradient(ellipse, ${colors.accent}40 0%, transparent 70%)`,
      filter: 'blur(60px)',
      opacity,
      pointerEvents: 'none'
    }} />
  );
};

// Masked text reveal (text revealed by sliding shape)
const MaskedReveal = ({ text, frame, fps, fontSize, color, fontWeight = '900', delay = 0 }) => {
  const words = text.split(' ');
  const wordsPerSecond = 4;
  
  return (
    <div style={{ textAlign: 'center' }}>
      {words.map((word, i) => {
        const wordFrame = frame - delay - (i * (fps / wordsPerSecond));
        const opacity = interpolate(wordFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const clipProgress = interpolate(wordFrame, [0, 12], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        const scale = interpolate(wordFrame, [0, 8], [1.1, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity,
            transform: `scale(${scale})`,
            marginRight: '0.2em',
            fontSize,
            fontWeight,
            color,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.03em',
            clipPath: `inset(0 ${100 - clipProgress}% 0 0)`
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Animated line divider
const AnimatedLine = ({ frame, color, width = 80, delay = 0 }) => {
  const lineW = interpolate(frame - delay, [0, 15], [0, width], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: lineW,
      height: 2,
      background: `linear-gradient(90deg, ${color}, transparent)`,
      margin: '16px auto'
    }} />
  );
};

// Stat counter with large number
const StatDisplay = ({ number, label, frame, fps, color, delay = 0 }) => {
  const scale = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''));
  const suffix = number.replace(/[0-9]/g, '');
  const currentValue = interpolate(frame - delay, [0, 25], [0, numericValue], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
      <div style={{
        fontSize: 72,
        fontWeight: '900',
        color,
        fontFamily: 'Inter, sans-serif',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.04em',
        lineHeight: 1
      }}>
        {Math.floor(currentValue)}{suffix}
      </div>
      <div style={{
        fontSize: 18,
        color: '#94A3B8',
        marginTop: 8,
        fontWeight: '500',
        fontFamily: 'Inter, sans-serif'
      }}>
        {label}
      </div>
    </div>
  );
};

// ===== SCENES =====

// Scene 1: Dark opening with logo reveal
const CinematicLogo = ({ style, width, height, frame, fps }) => {
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame, fps, config: { damping: 200, stiffness: 200, mass: 0.3 } });
  const logoOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      {/* Dark gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, ${style.colors.bg} 0%, #000000 100%)`,
        opacity: bgOpacity
      }} />
      
      {/* Subtle vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
      }} />
      
      {/* Logo */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: 'center' }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.accent})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 20px',
            boxShadow: `0 0 60px ${style.colors.primary}40`
          }}>
            <span style={{ fontSize: 48, fontWeight: '900', color: '#000' }}>AI</span>
          </div>
          <h1 style={{
            fontSize: 42,
            fontWeight: '900',
            color: style.colors.text,
            margin: 0,
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif'
          }}>
            AISolutionsHub
          </h1>
        </div>
      </AbsoluteFill>
      
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 2: Hook with masked reveal + stat
const CinematicHook = ({ hook, style, width, height, frame, fps }) => {
  const subtitleOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      {/* Background gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 30% 50%, ${style.colors.bg} 0%, #000000 70%)`
      }} />
      
      <LightLeak frame={frame} colors={style.colors} />
      
      {/* Content */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <AnimatedLine frame={frame} color={style.colors.primary} width={60} />
          
          <MaskedReveal
            text={hook}
            frame={frame}
            fps={fps}
            fontSize={52}
            color={style.colors.text}
            fontWeight="900"
            delay={5}
          />
          
          <p style={{
            fontSize: 20,
            color: '#94A3B8',
            marginTop: 20,
            opacity: subtitleOpacity,
            fontFamily: 'Inter, sans-serif',
            fontWeight: '400'
          }}>
            The future of automation is here
          </p>
        </div>
      </AbsoluteFill>
      
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 3: Feature with split layout (stat + text)
const CinematicFeature = ({ feature, index, style, width, height, frame, fps }) => {
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const cardY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });
  
  // Extract number from title if present
  const numberMatch = feature.title.match(/(\d+%?)/);
  const statNumber = numberMatch ? numberMatch[1] : null;
  const cleanTitle = statNumber ? feature.title.replace(numberMatch[0], '').trim() : feature.title;

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 70% 30%, ${style.colors.bg} 0%, #000000 70%)`
      }} />
      
      <LightLeak frame={frame} colors={style.colors} />
      
      {/* Content */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
          textAlign: 'center',
          maxWidth: 600
        }}>
          {/* Icon */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `${style.colors.primary}15`,
            border: `1px solid ${style.colors.primary}30`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 24px',
            fontSize: 40
          }}>
            {feature.icon || '✨'}
          </div>
          
          {/* Stat number if present */}
          {statNumber && (
            <StatDisplay
              number={statNumber}
              label={cleanTitle}
              frame={frame}
              fps={fps}
              color={style.colors.primary}
              delay={10}
            />
          )}
          
          {/* Title */}
          {!statNumber && (
            <h3 style={{
              fontSize: 44,
              fontWeight: '900',
              color: style.colors.text,
              margin: '0 0 12px',
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, sans-serif'
            }}>
              {feature.title}
            </h3>
          )}
          
          {/* Description */}
          <p style={{
            fontSize: 20,
            color: '#94A3B8',
            margin: 0,
            lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif'
          }}>
            {feature.desc}
          </p>
          
          {/* Progress line */}
          <div style={{
            marginTop: 24,
            height: 2,
            background: `${style.colors.primary}20`,
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${interpolate(frame, [0, 40], [0, 100], { extrapolateRight: 'clamp' })}%`,
              background: `linear-gradient(90deg, ${style.colors.primary}, ${style.colors.accent})`,
              borderRadius: 1
            }} />
          </div>
        </div>
      </AbsoluteFill>
      
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 4: CTA with cinematic fade
const CinematicCTA = ({ cta, style, width, height, frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, ${style.colors.bg} 0%, #000000 80%)`
      }} />
      
      <LightLeak frame={frame} colors={style.colors} />
      
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center', maxWidth: 600 }}>
          <h3 style={{
            fontSize: 48,
            fontWeight: '900',
            color: style.colors.text,
            margin: '0 0 16px',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif'
          }}>
            Ready to transform your business?
          </h3>
          
          <p style={{
            fontSize: 20,
            color: '#94A3B8',
            margin: '0 0 32px',
            fontFamily: 'Inter, sans-serif'
          }}>
            Join thousands of businesses already using AI
          </p>
          
          {/* CTA Button */}
          <div style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.accent})`,
            borderRadius: 12,
            boxShadow: `0 0 40px ${style.colors.primary}40`,
            marginBottom: 16
          }}>
            <span style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#000',
              fontFamily: 'Inter, sans-serif'
            }}>
              {cta?.text || 'Start Free'}
            </span>
          </div>
          
          <p style={{
            fontSize: 18,
            color: '#64748B',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            {cta?.url || 'aisolutionshub.org'}
          </p>
        </div>
      </AbsoluteFill>
      
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

export const CinematicTemplate = ({ hook, features, cta, config, style, audio }) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  
  const LOGO_DURATION = 50;
  const HOOK_DURATION = 80;
  const FEATURE_DURATION = 65;
  const CTA_DURATION = 90;
  const TRANSITION = 12;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={LOGO_DURATION}>
          <CinematicLogo style={style} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION} />
        
        <TransitionSeries.Sequence durationInFrames={HOOK_DURATION}>
          <CinematicHook hook={hook} style={style} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION} />
        
        {features && features.map((feature, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={FEATURE_DURATION}>
              <CinematicFeature feature={feature} index={i} style={style} width={width} height={height} frame={frame} fps={fps} />
            </TransitionSeries.Sequence>
            {i < features.length - 1 && (
              <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION} />
            )}
          </React.Fragment>
        ))}
        
        <TransitionSeries.Transition presentation={fade()} durationInFrames={TRANSITION} />
        <TransitionSeries.Sequence durationInFrames={CTA_DURATION}>
          <CinematicCTA cta={cta} style={style} width={width} height={height} frame={frame} fps={fps} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
