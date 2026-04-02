/**
 * Render Service - Remotion + headless Chrome
 * Optimized for Render.com free tier (512MB RAM)
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const app = express();
app.use(express.json({ limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body).substring(0, 500));
  }
  next();
});

// Bundle cache (avoid re-bundling every render)
let cachedBundle = null;
let bundleTime = 0;
const BUNDLE_CACHE_TTL = 3600000; // 1 hour

async function getBundle() {
  const now = Date.now();
  if (cachedBundle && (now - bundleTime) < BUNDLE_CACHE_TTL) {
    console.log('Using cached bundle');
    return cachedBundle;
  }
  
  console.log('Bundling Remotion project...');
  cachedBundle = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.js'),
    webpackOverride: (config) => config,
  });
  bundleTime = now;
  console.log('Bundle ready:', cachedBundle);
  return cachedBundle;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    bundleCached: !!cachedBundle
  });
});

// Debug endpoint
app.post('/debug', (req, res) => {
  console.log('DEBUG endpoint hit:', req.body);
  res.json({ received: true, body: req.body });
});

// Main render endpoint (async with callback)
app.post('/render', async (req, res) => {
  const startTime = Date.now();
  const { briefId, brief, callbackUrl } = req.body;
  console.log(`[${briefId}] Starting async render...`);

  res.json({ success: true, briefId, status: 'started' });

  try {
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
      crf: 28, // Lower quality, faster render
      scale: 0.75, // 75% resolution for free tier
    });

    const videoBuffer = fs.readFileSync(outputPath);
    const videoBase64 = videoBuffer.toString('base64');
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${briefId}] Complete: ${renderTime}s, ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, status: 'completed', videoBase64, renderTime })
      });
    }

    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error(`[${briefId}] Failed:`, err.message);
    if (callbackUrl) {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, status: 'failed', error: err.message })
      }).catch(() => {});
    }
  }
});

// Direct render (returns video immediately)
app.post('/render-direct', async (req, res) => {
  const startTime = Date.now();
  const { brief } = req.body;
  const briefId = `direct-${Date.now()}`;
  console.log(`[${briefId}] Starting direct render...`);

  try {
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
      crf: 28,
      scale: 0.75, // 75% resolution
      timeoutInMilliseconds: 120000, // 2 min timeout
    });

    const videoBuffer = fs.readFileSync(outputPath);
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${briefId}] Direct complete: ${renderTime}s`);

    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${briefId}.mp4"`);
    res.send(videoBuffer);

    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error(`[${briefId}] Direct failed:`, err.message);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

function prepareProps(brief) {
  const platformConfig = {
    instagram: { width: 720, height: 1280, fps: 24 },  // Reduced for free tier
    tiktok: { width: 720, height: 1280, fps: 24 },
    youtube: { width: 720, height: 1280, fps: 24 },
    linkedin: { width: 1280, height: 720, fps: 24 },
    twitter: { width: 1280, height: 720, fps: 24 }
  };

  return {
    hook: brief.hook || 'Automate Your Business',
    features: brief.features || [],
    cta: brief.cta || { text: 'Visit AISolutionsHub.org', url: 'aisolutionshub.org' },
    config: platformConfig[brief.platform] || platformConfig.instagram,
    style: brief.style || { primaryColor: '#6366f1', secondaryColor: '#818cf8' }
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Render service running on port ${PORT}`);
});
