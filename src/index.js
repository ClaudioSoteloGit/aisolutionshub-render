import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { PromoHighlight } from './compositions/PromoHighlight';

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PromoHighlight"
        component={PromoHighlight}
        durationInFrames={360}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          hook: 'Automate Your Business with AI',
          features: [
            { icon: '⚡', title: 'Instant Setup', desc: 'Ready in 5 minutes' },
            { icon: '🤖', title: 'AI-Powered', desc: 'Smart automation' },
          ],
          cta: { text: 'Start Free', url: 'aisolutionshub.org' },
          config: { width: 720, height: 1280, fps: 30 },
          style: { primaryColor: '#6366f1', secondaryColor: '#818cf8' },
          audio: { enabled: false },
          visualStyle: 'dynamic'
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
