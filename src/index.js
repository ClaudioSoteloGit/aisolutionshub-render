import React from 'react';
import { Composition } from 'remotion';
import { PromoHighlight } from './compositions/PromoHighlight';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PromoHighlight"
        component={PromoHighlight}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: 'Automate Your Business with AI',
          features: [
            { icon: '⚡', title: 'Instant Setup', desc: 'Ready in 5 minutes' },
            { icon: '🤖', title: 'AI-Powered', desc: 'Smart automation' },
            { icon: '🎯', title: 'Results-Driven', desc: 'Proven outcomes' }
          ],
          cta: { text: 'Visit AISolutionsHub.org', url: 'aisolutionshub.org' },
          config: { width: 1080, height: 1920, fps: 30 },
          style: { primaryColor: '#6366f1', secondaryColor: '#818cf8' }
        }}
      />
    </>
  );
};
