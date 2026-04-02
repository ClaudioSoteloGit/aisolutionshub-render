import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const PromoHighlight = ({ hook, features, cta, config, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const primaryColor = style?.primaryColor || '#6366f1';
  const secondaryColor = style?.secondaryColor || '#818cf8';

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {/* Animated background */}
      <Background primaryColor={primaryColor} />

      {/* Logo - 0-2s */}
      <Sequence from={0} durationInFrames={60}>
        <Logo primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>

      {/* Hook - 2-5s */}
      <Sequence from={60} durationInFrames={90}>
        <HookText text={hook} />
      </Sequence>

      {/* Features - 5-14s */}
      {features && features.map((feature, i) => (
        <Sequence key={i} from={150 + i * 90} durationInFrames={90}>
          <FeatureCard feature={feature} primaryColor={primaryColor} />
        </Sequence>
      ))}

      {/* CTA - 14-20s */}
      <Sequence from={420} durationInFrames={180}>
        <CallToAction cta={cta} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Background = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 600], [0, 360]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${angle}deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)`
    }}>
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} />
    </AbsoluteFill>
  );
};

const Logo = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity, transform: `scale(${scale})` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
        <div style={{
          width: 120, height: 120, borderRadius: 24,
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 25px ${primaryColor}80`
        }}>
          <div style={{ fontSize: 60, color: '#fff', fontWeight: 'bold' }}>AI</div>
        </div>
        <div style={{ fontSize: 42, fontWeight: 'bold', color: '#fff', letterSpacing: '-0.02em' }}>
          AISolutionsHub
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8' }}>Your AI Automation Partner</div>
      </div>
    </AbsoluteFill>
  );
};

const HookText = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [80, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity, transform: `translateY(${translateY}px)` }}>
      <div style={{ fontSize: 64, fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: '0 40px' }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const FeatureCard = ({ feature, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [50, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity, transform: `translateY(${translateY}px)` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 40 }}>
        <div style={{ fontSize: 80 }}>{feature.icon}</div>
        <div style={{ fontSize: 48, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>{feature.title}</div>
        <div style={{ fontSize: 32, color: '#94a3b8', textAlign: 'center' }}>{feature.desc}</div>
      </div>
    </AbsoluteFill>
  );
};

const CallToAction = ({ cta, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = frame > 30 ? interpolate(Math.sin((frame - 30) * 0.15), [-1, 1], [1, 1.05]) : 1;
  const glow = interpolate(Math.sin(frame * 0.1), [-1, 1], [15, 35]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity, transform: `scale(${scale * pulse})` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ fontSize: 36, color: '#e2e8f0' }}>Ready to transform your business?</div>
        <div style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          padding: '24px 48px', borderRadius: 16,
          boxShadow: `0 0 ${glow}px ${primaryColor}99, 0 10px 40px rgba(0,0,0,0.3)`
        }}>
          <div style={{ fontSize: 44, fontWeight: 'bold', color: '#fff' }}>{cta?.text || 'Start Free'}</div>
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8' }}>{cta?.url || 'aisolutionshub.org'}</div>
      </div>
    </AbsoluteFill>
  );
};
