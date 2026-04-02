/**
 * Render Service - Remotion + headless Chrome
 * ULTRA-LIGHT for Render.com free tier (512MB RAM)
 * Resolution: 480p, minimal memory footprint
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Logging
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// Bundle cache
let cachedBundle = null;

async function getBundle() {
  if (cachedBundle) {
    log('Using cached bundle');
    return cachedBundle;
  }
  log('Bundling (first time)...');
  cachedBundle = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.js'),
    webpackOverride: (config) => config,
  });
  log('Bundle ready');
  return cachedBundle;
}

// Health
app.get('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memoryMB: Math.round(mem.rss / 1024 / 1024),
    bundleCached: !!cachedBundle
  });
});

// Render (async)
app.post('/render', async (req, res) => {
  const { briefId, brief, callbackUrl } = req.body;
  log(`[${briefId}] Render started`);

  res.json({ success: true, briefId, status: 'started' });

  try {
    const videoBuffer = await doRender(brief, briefId);
    const videoBase64 = videoBuffer.toString('base64');
    log(`[${briefId}] Done: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, status: 'completed', videoBase64 })
      }).catch(e => log(`Callback failed: ${e.message}`));
    }
  } catch (err) {
    log(`[${briefId}] Failed: ${err.message}`);
    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, status: 'failed', error: err.message })
      }).catch(() => {});
    }
  }
});

// Render direct
app.post('/render-direct', async (req, res) => {
  const { brief } = req.body;
  const briefId = `direct-${Date.now()}`;
  log(`[${briefId}] Direct render`);

  try {
    const videoBuffer = await doRender(brief, briefId);
    log(`[${briefId}] Done: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    res.set('Content-Type', 'video/mp4');
    res.send(videoBuffer);
  } catch (err) {
    log(`[${briefId}] Failed: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Core render function
async function doRender(brief, briefId) {
  const startTime = Date.now();
  const props = prepareProps(brief);
  const bundled = await getBundle();

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
    crf: 32,       // Lower quality = smaller file = less memory
    scale: 0.5,    // 50% resolution (480p from 960p base)
  });

  const buffer = fs.readFileSync(outputPath);
  fs.unlinkSync(outputPath);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`[${briefId}] Render took ${elapsed}s`);

  return buffer;
}

function prepareProps(brief) {
  // Ultra-light config: 480p, 24fps, 12 seconds
  const configs = {
    instagram: { width: 480, height: 854, fps: 24 },
    tiktok: { width: 480, height: 854, fps: 24 },
    youtube: { width: 480, height: 854, fps: 24 },
    linkedin: { width: 854, height: 480, fps: 24 },
    twitter: { width: 854, height: 480, fps: 24 }
  };

  return {
    hook: brief.hook || 'AISolutionsHub',
    features: brief.features || [],
    cta: brief.cta || { text: 'Visit', url: 'aisolutionshub.org' },
    config: configs[brief.platform] || configs.instagram,
    style: brief.style || { primaryColor: '#6366f1', secondaryColor: '#818cf8' }
  };
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => log(`Running on port ${PORT}`));
