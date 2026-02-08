/**
 * Pulls the latest BrowserStack build results and generates
 * a standalone HTML report with embedded videos, logs, and details.
 *
 * Usage: npx tsx scripts/browserstack-report.ts
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BS_USER = process.env.BROWSERSTACK_USERNAME!;
const BS_KEY = process.env.BROWSERSTACK_ACCESS_KEY!;
const AUTH = Buffer.from(`${BS_USER}:${BS_KEY}`).toString('base64');

function bsGet(urlPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = urlPath.startsWith('http')
      ? new URL(urlPath)
      : new URL(`https://api.browserstack.com${urlPath}`);

    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { Authorization: `Basic ${AUTH}` },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    }).on('error', reject);
  });
}

async function main() {
  // 1. Get latest build
  const builds = await bsGet('/automate/builds.json?limit=1');
  if (!builds.length) { console.log('No builds found.'); return; }

  const build = builds[0].automation_build;
  console.log(`Build: ${build.name} (${build.status})`);

  // 2. Get all sessions
  const sessionsData = await bsGet(`/automate/builds/${build.hashed_id}/sessions.json`);
  const sessions = sessionsData.map((s: any) => s.automation_session);

  console.log(`Sessions: ${sessions.length}`);

  // 3. Generate HTML report
  const timestamp = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' });
  const passCount = sessions.filter((s: any) => s.status === 'done').length;
  const failCount = sessions.filter((s: any) => s.status === 'error').length;

  let sessionsHtml = '';
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i];
    const statusColor = s.status === 'done' ? '#2e7d32' : '#c62828';
    const statusLabel = s.status === 'done' ? 'PASSED' : 'FAILED';
    const duration = s.duration ? `${Math.round(s.duration / 60)}m ${s.duration % 60}s` : 'N/A';

    sessionsHtml += `
    <div class="session">
      <div class="session-header">
        <div>
          <span class="status" style="background:${statusColor}">${statusLabel}</span>
          <strong>Session ${i + 1}: ${s.name}</strong>
        </div>
        <div class="meta">
          ${s.browser} ${s.browser_version} · ${s.os} ${s.os_version} · ${duration}
        </div>
      </div>

      <div class="video-container">
        <video controls preload="metadata" width="100%">
          <source src="${s.video_url || ''}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>

      <div class="details">
        <a href="${s.browser_console_logs_url || '#'}" target="_blank">Console Logs</a>
        <a href="${s.har_logs_url || '#'}" target="_blank">Network Logs (HAR)</a>
        <a href="${s.browser_url || '#'}" target="_blank">Full BrowserStack Session</a>
      </div>
    </div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abba Medix E2E Test Report - ${build.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; color: #333; }
    .header { background: linear-gradient(135deg, #1a5632, #2e7d32); color: white; padding: 30px 40px; }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .summary { display: flex; gap: 20px; padding: 20px 40px; background: white; border-bottom: 1px solid #e0e0e0; }
    .summary-card { padding: 16px 24px; border-radius: 8px; text-align: center; min-width: 120px; }
    .summary-card .number { font-size: 32px; font-weight: 700; }
    .summary-card .label { font-size: 12px; text-transform: uppercase; margin-top: 4px; opacity: 0.7; }
    .card-total { background: #e3f2fd; color: #1565c0; }
    .card-pass { background: #e8f5e9; color: #2e7d32; }
    .card-fail { background: #ffebee; color: #c62828; }
    .card-time { background: #fff3e0; color: #e65100; }
    .container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
    .session { background: white; border-radius: 12px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .session-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; gap: 8px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 4px; color: white; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; margin-right: 10px; }
    .meta { color: #888; font-size: 13px; }
    .video-container { padding: 16px; background: #fafafa; }
    video { border-radius: 8px; max-height: 500px; }
    .details { display: flex; gap: 16px; padding: 12px 20px; border-top: 1px solid #f0f0f0; }
    .details a { color: #1565c0; text-decoration: none; font-size: 13px; }
    .details a:hover { text-decoration: underline; }
    .footer { text-align: center; padding: 30px; color: #999; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Abba Medix - E2E Test Report</h1>
    <p>${build.name} · Generated ${timestamp}</p>
  </div>

  <div class="summary">
    <div class="summary-card card-total">
      <div class="number">${sessions.length}</div>
      <div class="label">Total Sessions</div>
    </div>
    <div class="summary-card card-pass">
      <div class="number">${passCount}</div>
      <div class="label">Passed</div>
    </div>
    <div class="summary-card card-fail">
      <div class="number">${failCount}</div>
      <div class="label">Failed</div>
    </div>
    <div class="summary-card card-time">
      <div class="number">${Math.round((build.duration || 0) / 60)}m</div>
      <div class="label">Total Time</div>
    </div>
  </div>

  <div class="container">
    ${sessionsHtml}
  </div>

  <div class="footer">
    Abba Medix E2E Testing · Powered by Playwright + BrowserStack · ${timestamp}
  </div>
</body>
</html>`;

  // 4. Save the report
  const reportsDir = path.join(process.cwd(), 'reports-history');
  const ts = new Date().toISOString().replace(/[T:]/g, '-').slice(0, 19);
  const destDir = path.join(reportsDir, `bs-${ts}`);
  fs.mkdirSync(destDir, { recursive: true });

  const reportPath = path.join(destDir, 'index.html');
  fs.writeFileSync(reportPath, html);

  console.log(`\nReport saved to: ${reportPath}`);
  console.log(`\nOpen locally:  npx open-cli ${reportPath}`);
  console.log(`Or just open:  ${reportPath}`);
}

main().catch(console.error);
