/**
 * Render Service - Remotion + headless Chrome
 * Deployed on Render.com free tier
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const app = express();
app.use(express.json({ limit: '50mb' }));

// Health check for Render.com
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Main render endpoint
app.post('/render', async (req, res) => {
  const startTime = Date.now();
  const { briefId, brief, callbackUrl } = req.body;

  console.log(`[${briefId}] Starting render...`);

  // Respond immediately (async processing)
  res.json({ success: true, briefId, status: 'started' });

  try {
    // 1. Prepare props from brief
    const props = prepareProps(brief);

    // 2. Bundle Remotion project
    console.log(`[${briefId}] Bundling...`);
    const bundled = await bundle({
      entryPoint: path.join(__dirname, 'src', 'index.js'),
      webpackOverride: (config) => config,
    });

    // 3. Select composition
    console.log(`[${briefId}] Selecting composition...`);
    const composition = await selectComposition({
      serveUrl: bundled,
      id: brief.template || 'PromoHighlight',
      inputProps: props,
    });

    // 4. Render video
    console.log(`[${briefId}] Rendering video...`);
    const outputPath = `/tmp/${briefId}.mp4`;

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props,
      crf: 23,
    });

    // 5. Read rendered video
    const videoBuffer = fs.readFileSync(outputPath);
    const videoBase64 = videoBuffer.toString('base64');
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`[${briefId}] Render complete in ${renderTime}s (${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

    // 6. Send callback to worker
    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefId,
          status: 'completed',
          videoBase64,
          renderTime
        })
      });
    }

    // Cleanup
    fs.unlinkSync(outputPath);

  } catch (err) {
    console.error(`[${briefId}] Render failed:`, err.message);

    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefId,
          status: 'failed',
          error: err.message
        })
      }).catch(() => {});
    }
  }
});

// Direct render endpoint (returns video directly)
app.post('/render-direct', async (req, res) => {
  const startTime = Date.now();
  const { brief } = req.body;
  const briefId = `direct-${Date.now()}`;

  console.log(`[${briefId}] Starting direct render...`);

  try {
    const props = prepareProps(brief);

    const bundled = await bundle({
      entryPoint: path.join(__dirname, 'src', 'index.js'),
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl: bundled,
      id: brief.template || 'PromoHighlight',
      inputProps: props,
    });

    const outputPath = `/tmp/${briefId}.mp4`;

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props,
      crf: 23,
    });

    const videoBuffer = fs.readFileSync(outputPath);
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`[${briefId}] Complete in ${renderTime}s`);

    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${briefId}.mp4"`);
    res.send(videoBuffer);

    fs.unlinkSync(outputPath);

  } catch (err) {
    console.error(`[${briefId}] Failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Prepare Remotion props from brief
function prepareProps(brief) {
  const platformConfig = {
    instagram: { width: 1080, height: 1920, fps: 30 },
    tiktok: { width: 1080, height: 1920, fps: 30 },
    youtube: { width: 1080, height: 1920, fps: 30 },
    linkedin: { width: 1920, height: 1080, fps: 30 },
    twitter: { width: 1920, height: 1080, fps: 30 }
  };

  return {
    hook: brief.hook || 'Automate Your Business',
    features: brief.features || [],
    cta: brief.cta || { text: 'Visit AISolutionsHub.org', url: 'aisolutionshub.org' },
    config: platformConfig[brief.platform] || platformConfig.instagram,
    style: brief.style || {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8'
    }
  };
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Render service running on port ${PORT}`);
});
