import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { CinematicTemplate } from './compositions/Cinematic';

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Cinematic"
        component={CinematicTemplate}
        durationInFrames={360}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          hook: 'Automate Your Business with AI',
          features: [
            { icon: '⚡', title: '70% Cost Reduction', desc: 'Eliminate monetary inefficiencies through intelligent automation' },
            { icon: '🔄', title: '24/7 Operations', desc: 'Systems that never rest, processing data while you scale' },
          ],
          cta: { text: 'Start Free', url: 'aisolutionshub.org' },
          config: { width: 720, height: 1280, fps: 30, platform: 'tiktok' },
          style: {
            name: 'cinematic',
            colors: {
              bg: '#0F172A',
              primary: '#2DD4BF',
              secondary: '#14B8A6',
              accent: '#2563EB',
              text: '#F8FAFC',
              muted: '#94A3B8'
            }
          },
          audio: { enabled: false }
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
