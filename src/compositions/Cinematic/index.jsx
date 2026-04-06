/**
 * CINEMATIC TEMPLATE v2 - Stock Footage + User Uploads + Organic Backgrounds
 * Professional motion design with real video backgrounds
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Video,
  Img,
  staticFile
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
  }, [frame % 3]);

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

// ===== BACKGROUNDS =====

// Stock video background (if user provides one)
const VideoBackground = ({ videoUrl, opacity = 0.4 }) => {
  if (!videoUrl) return null;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Video
        src={videoUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity
        }}
      />
      {/* Dark overlay for text readability */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)'
      }} />
    </AbsoluteFill>
  );
};

// Image background with parallax
const ImageBackground = ({ imageUrl, frame, width, height, opacity = 0.5 }) => {
  if (!imageUrl) return null;
  
  // Parallax effect
  const parallaxX = interpolate(frame, [0, 360], [-20, 20], { extrapolateRight: 'clamp' });
  const parallaxY = interpolate(frame, [0, 360], [-10, 10], { extrapolateRight: 'clamp' });
  const scale = 1.1; // Slight zoom to allow parallax movement

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{
        transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${scale})`,
        transformOrigin: 'center center'
      }}>
        <Img
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {/* Dark overlay */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
        opacity
      }} />
    </AbsoluteFill>
  );
};

// Procedural organic background (fallback)
const OrganicBackground = ({ colors, width, height, frame }) => {
  const t = frame / 360;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Base gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at ${30 + Math.sin(t * Math.PI) * 20}% ${40 + Math.cos(t * Math.PI * 0.7) * 20}%, ${colors.bg} 0%, #000000 80%)`
      }} />
      
      {/* Animated mesh gradient effect */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${colors.primary}08 0%, transparent 70%)`,
        filter: 'blur(80px)',
        transform: `translate(${Math.sin(t * Math.PI * 2) * 30}px, ${Math.cos(t * Math.PI * 1.5) * 20}px)`
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${colors.accent}06 0%, transparent 70%)`,
        filter: 'blur(100px)',
        transform: `translate(${Math.cos(t * Math.PI * 1.3) * 25}px, ${Math.sin(t * Math.PI * 2) * 15}px)`
      }} />
      
      {/* Subtle noise texture */}
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Background selector
const Background = ({ videoUrl, imageUrl, style, width, height, frame }) => {
  if (videoUrl) return <VideoBackground videoUrl={videoUrl} />;
  if (imageUrl) return <ImageBackground imageUrl={imageUrl} frame={frame} width={width} height={height} />;
  return <OrganicBackground colors={style.colors} width={width} height={height} frame={frame} />;
};

// ===== TEXT COMPONENTS =====

// Word-by-word masked reveal
const HookWords = ({ text, frame, fps, style, delay = 0 }) => {
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
            fontSize: 52,
            fontWeight: '900',
            color: style.colors.text,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.03em',
            clipPath: `inset(0 ${100 - clipProgress}% 0 0)`,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Stat counter with animation
const StatCounter = ({ number, label, frame, fps, color, delay = 0 }) => {
  const scale = spring({ frame: frame - delay, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''));
  const suffix = number.replace(/[0-9]/g, '');
  const currentValue = interpolate(frame - delay, [0, 25], [0, numericValue], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center', marginBottom: 12 }}>
      <div style={{
        fontSize: 72,
        fontWeight: '900',
        color,
        fontFamily: 'Inter, sans-serif',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        textShadow: '0 2px 20px rgba(0,0,0,0.5)'
      }}>
        {Math.floor(currentValue)}{suffix}
      </div>
      {label && (
        <div style={{
          fontSize: 18,
          color: '#94A3B8',
          marginTop: 8,
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          textShadow: '0 1px 10px rgba(0,0,0,0.5)'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

// ===== SCENES =====

// Scene 1: Logo with optional user logo
const CinematicLogo = ({ brandName, logoUrl, style, width, height, frame, fps }) => {
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame, fps, config: { damping: 200, stiffness: 200, mass: 0.3 } });
  const logoOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: 'clamp' });

  const boxSize = Math.min(width, height) * 0.15;
  const name = brandName || 'Your Brand';

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <Background videoUrl={style.videoUrl} imageUrl={style.imageUrl} style={style} width={width} height={height} frame={frame} />
      
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        opacity: bgOpacity
      }} />
      
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: 'center' }}>
          {/* Logo: user image OR generated initials */}
          {logoUrl ? (
            <Img
              src={logoUrl}
              style={{
                width: boxSize,
                height: boxSize,
                borderRadius: boxSize * 0.25,
                objectFit: 'cover',
                margin: '0 auto 20px',
                boxShadow: `0 0 60px ${style.colors.primary}40`
              }}
            />
          ) : (
            <div style={{
              width: boxSize,
              height: boxSize,
              borderRadius: boxSize * 0.25,
              background: `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.accent})`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 0 60px ${style.colors.primary}40`
            }}>
              <span style={{ fontSize: boxSize * 0.45, fontWeight: '900', color: '#000', fontFamily: 'Inter, sans-serif' }}>
                {name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          <h1 style={{
            fontSize: Math.min(width, height) * 0.06,
            fontWeight: '900',
            color: style.colors.text,
            margin: '0 0 8px',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            {name}
          </h1>
          
          <p style={{
            fontSize: Math.min(width, height) * 0.025,
            color: style.colors.muted,
            margin: 0,
            fontWeight: '400',
            fontFamily: 'Inter, sans-serif',
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
          }}>
            {style.tagline || 'Innovation starts here'}
          </p>
        </div>
      </AbsoluteFill>
      
      <LightLeak frame={frame} colors={style.colors} />
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 2: Hook
const CinematicHook = ({ hook, style, width, height, frame, fps }) => {
  const subtitleOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <Background videoUrl={style.videoUrl} imageUrl={style.imageUrl} style={style} width={width} height={height} frame={frame} />
      
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          {/* Accent line */}
          <div style={{
            width: interpolate(frame, [0, 15], [0, 60], { extrapolateRight: 'clamp' }),
            height: 2,
            background: `linear-gradient(90deg, ${style.colors.primary}, transparent)`,
            margin: '0 auto 20px'
          }} />
          
          <HookWords text={hook} frame={frame} fps={fps} style={style} delay={5} />
          
          <p style={{
            fontSize: 20,
            color: style.colors.muted,
            marginTop: 20,
            opacity: subtitleOpacity,
            fontFamily: 'Inter, sans-serif',
            fontWeight: '400',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
          }}>
            {style.subtitle || 'Discover what is possible'}
          </p>
        </div>
      </AbsoluteFill>
      
      <LightLeak frame={frame} colors={style.colors} />
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 3: Feature with stat
const CinematicFeature = ({ feature, index, style, width, height, frame, fps }) => {
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const cardY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });
  
  const numberMatch = feature.title.match(/(\d+%?)/);
  const statNumber = numberMatch ? numberMatch[1] : null;
  const cleanTitle = statNumber ? feature.title.replace(numberMatch[0], '').trim() : feature.title;

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <Background videoUrl={style.videoUrl} imageUrl={style.imageUrl} style={style} width={width} height={height} frame={frame} />
      
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
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${style.colors.primary}30`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 24px',
            fontSize: 40,
            boxShadow: `0 0 30px ${style.colors.primary}20`
          }}>
            {feature.icon || '✨'}
          </div>
          
          {statNumber && (
            <StatCounter
              number={statNumber}
              label={cleanTitle}
              frame={frame}
              fps={fps}
              color={style.colors.primary}
              delay={10}
            />
          )}
          
          {!statNumber && (
            <h3 style={{
              fontSize: 44,
              fontWeight: '900',
              color: style.colors.text,
              margin: '0 0 12px',
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, sans-serif',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)'
            }}>
              {feature.title}
            </h3>
          )}
          
          <p style={{
            fontSize: 20,
            color: style.colors.muted,
            margin: 0,
            lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
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
      
      <LightLeak frame={frame} colors={style.colors} />
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CinematicCTA = ({ cta, style, width, height, frame, fps }) => {
  const scale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <Background videoUrl={style.videoUrl} imageUrl={style.imageUrl} style={style} width={width} height={height} frame={frame} />
      
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center', maxWidth: 600 }}>
          <h3 style={{
            fontSize: 48,
            fontWeight: '900',
            color: style.colors.text,
            margin: '0 0 24px',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.2,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            {cta?.headline || 'Ready to get started?'}
          </h3>
          
          <p style={{
            fontSize: 20,
            color: style.colors.muted,
            margin: '0 0 40px',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5,
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
          }}>
            {cta?.subtitle || 'Take the first step today'}
          </p>
          
          <div style={{
            display: 'inline-block',
            padding: '18px 48px',
            background: `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.accent})`,
            borderRadius: 14,
            boxShadow: `0 0 40px ${style.colors.primary}40`,
            marginBottom: 20
          }}>
            <span style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#000',
              fontFamily: 'Inter, sans-serif'
            }}>
              {cta?.text || 'Learn More'}
            </span>
          </div>
          
          <p style={{
            fontSize: 18,
            color: '#64748B',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: '500',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
          }}>
            {cta?.url || ''}
          </p>
        </div>
      </AbsoluteFill>
      
      <LightLeak frame={frame} colors={style.colors} />
      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};

// ===== MAIN TEMPLATE =====
export const CinematicTemplate = ({ brandName, hook, features, cta, config, style, audio, logoUrl }) => {
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
          <CinematicLogo brandName={brandName} logoUrl={logoUrl} style={style} width={width} height={height} frame={frame} fps={fps} />
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
