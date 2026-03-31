const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const startedAt = new Date();

function formatUptime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}m`, `${seconds}s`]
    .filter(Boolean)
    .join(" ");
}

function buildOverview() {
  const uptimeSeconds = process.uptime();

  return {
    appName: "CodeAlpha CI/CD Dashboard",
    owner: "Ahmed",
    environment: process.env.NODE_ENV || "development",
    status: "running",
    version: "1.0.0",
    runtime: "Node.js + Express",
    port: PORT,
    uptime: formatUptime(uptimeSeconds),
    uptimeSeconds: Number(uptimeSeconds.toFixed(0)),
    startedAt: startedAt.toISOString(),
    updatedAt: new Date().toISOString(),
    services: [
      { name: "Web App", status: "Online", detail: "Dashboard and API are reachable." },
      { name: "Health Check", status: "Healthy", detail: "Endpoint returns HTTP 200." },
      { name: "Pipeline", status: "Ready", detail: "Prepared for CI/CD automation." }
    ],
    highlights: [
      "Fast status visibility for deployments and runtime health",
      "Clean entry point for demos, ops handoff, and monitoring previews",
      "Simple structure that can grow into a real production dashboard"
    ]
  };
}

app.get("/", (req, res) => {
  const overview = buildOverview();

  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${overview.appName}</title>
    <style>
      :root {
        --bg: #081120;
        --bg-soft: #101f36;
        --panel: rgba(11, 25, 48, 0.88);
        --panel-border: rgba(123, 169, 255, 0.18);
        --text: #f5f7fb;
        --muted: #9fb0ca;
        --accent: #56d4c0;
        --accent-2: #ffc857;
        --danger: #ff7272;
        --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(86, 212, 192, 0.14), transparent 30%),
          radial-gradient(circle at top right, rgba(255, 200, 87, 0.12), transparent 28%),
          linear-gradient(135deg, #07101c 0%, #0c1730 55%, #091a28 100%);
      }

      .shell {
        width: min(1180px, calc(100% - 32px));
        margin: 32px auto;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.4fr 0.9fr;
        gap: 24px;
        margin-bottom: 24px;
      }

      .panel {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: 24px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(12px);
      }

      .hero-copy {
        padding: 32px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(86, 212, 192, 0.12);
        color: var(--accent);
        font-size: 0.88rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .hero h1 {
        margin: 18px 0 14px;
        font-size: clamp(2.2rem, 5vw, 4.4rem);
        line-height: 0.98;
      }

      .hero p {
        margin: 0;
        max-width: 680px;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.7;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 14px;
        text-decoration: none;
        color: var(--text);
        border: 1px solid transparent;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      }

      .button.primary {
        background: linear-gradient(135deg, #56d4c0, #34a0ff);
        color: #061321;
        font-weight: 700;
      }

      .button.secondary {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.08);
      }

      .button:hover {
        transform: translateY(-2px);
      }

      .status-card {
        padding: 28px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .status-label {
        color: var(--muted);
        font-size: 0.94rem;
      }

      .status-value {
        margin-top: 8px;
        font-size: 2.8rem;
        font-weight: 800;
      }

      .live-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
        color: var(--accent);
      }

      .live-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 8px rgba(86, 212, 192, 0.12);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 24px;
      }

      .metrics,
      .services,
      .highlights {
        padding: 28px;
      }

      .metrics {
        grid-column: span 7;
      }

      .services {
        grid-column: span 5;
      }

      .highlights {
        grid-column: span 12;
      }

      .section-title {
        margin: 0 0 18px;
        font-size: 1.1rem;
      }

      .metric-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .metric-card {
        padding: 20px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .metric-card span {
        display: block;
      }

      .metric-name {
        color: var(--muted);
        font-size: 0.92rem;
      }

      .metric-value {
        margin-top: 10px;
        font-size: 1.8rem;
        font-weight: 700;
      }

      .service-list,
      .highlight-list {
        display: grid;
        gap: 14px;
      }

      .service-item,
      .highlight-item {
        padding: 18px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .service-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }

      .service-name {
        font-weight: 700;
      }

      .badge {
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.8rem;
        background: rgba(86, 212, 192, 0.12);
        color: var(--accent);
      }

      .muted {
        color: var(--muted);
        line-height: 1.6;
      }

      .footer-note {
        margin-top: 24px;
        text-align: center;
        color: var(--muted);
        font-size: 0.92rem;
      }

      @media (max-width: 900px) {
        .hero,
        .grid {
          grid-template-columns: 1fr;
        }

        .metrics,
        .services,
        .highlights {
          grid-column: auto;
        }
      }

      @media (max-width: 640px) {
        .shell {
          width: min(100% - 20px, 1180px);
          margin: 20px auto;
        }

        .hero-copy,
        .status-card,
        .metrics,
        .services,
        .highlights {
          padding: 20px;
        }

        .metric-cards {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <article class="panel hero-copy">
          <div class="eyebrow">Deployment overview</div>
          <h1>${overview.appName}</h1>
          <p>
            A polished control surface for tracking service health, runtime state,
            and CI/CD readiness in one clean view.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="/api/overview">View API Overview</a>
            <a class="button secondary" href="/health">Health Check</a>
          </div>
        </article>

        <aside class="panel status-card">
          <div>
            <div class="status-label">Current status</div>
            <div class="status-value">Online</div>
            <div class="live-pill">
              <span class="live-dot"></span>
              Live and serving traffic
            </div>
          </div>
          <div class="muted">
            Last refresh: ${overview.updatedAt}<br />
            Started at: ${overview.startedAt}
          </div>
        </aside>
      </section>

      <section class="grid">
        <article class="panel metrics">
          <h2 class="section-title">Core Metrics</h2>
          <div class="metric-cards">
            <div class="metric-card">
              <span class="metric-name">Environment</span>
              <span class="metric-value">${overview.environment}</span>
            </div>
            <div class="metric-card">
              <span class="metric-name">Version</span>
              <span class="metric-value">${overview.version}</span>
            </div>
            <div class="metric-card">
              <span class="metric-name">Runtime</span>
              <span class="metric-value">${overview.runtime}</span>
            </div>
            <div class="metric-card">
              <span class="metric-name">Uptime</span>
              <span class="metric-value">${overview.uptime}</span>
            </div>
          </div>
        </article>

        <article class="panel services">
          <h2 class="section-title">Service Status</h2>
          <div class="service-list">
            ${overview.services
              .map(
                (service) => `
                  <div class="service-item">
                    <div class="service-top">
                      <span class="service-name">${service.name}</span>
                      <span class="badge">${service.status}</span>
                    </div>
                    <div class="muted">${service.detail}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>

        <article class="panel highlights">
          <h2 class="section-title">Highlights</h2>
          <div class="highlight-list">
            ${overview.highlights
              .map((item) => `<div class="highlight-item muted">${item}</div>`)
              .join("")}
          </div>
        </article>
      </section>

      <div class="footer-note">
        Built for ${overview.owner} on port ${overview.port}.
      </div>
    </main>
  </body>
</html>`);
});

app.get("/api/overview", (req, res) => {
  res.json(buildOverview());
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    app: "CodeAlpha CI/CD Dashboard",
    checkedAt: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
