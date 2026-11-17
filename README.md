# Auralytix — Search Intelligence & AI Visibility Platform

An enterprise SEO, Generative Engine Optimization (GEO), and AI Overviews intelligence platform that audits how search engines and AI engines (ChatGPT, Google Gemini, Perplexity, Claude, Copilot) perceive, cite, and rank brand web properties.

---

## 🚀 Key Features

- **Multi-Engine AI Citations & GEO Probing**: Probes grounded Gemini and other AI citation engines to measure true visibility and brand claims.
- **13-Tab Detailed Audit Report (`report.html`)**:
  1. **Overview**: Executive summary, scores, share of voice, and high-level health indicators.
  2. **AIO — Pillar Breakdown**: Deterministic scores across content, structure, authority, and freshness.
  3. **GEO — Citation Standing**: Citations per prompt, model attribution, and visibility tiers.
  4. **Opportunities**: Prioritized team-level recommendations (Content, Technical SEO/GEO, Earned Content).
  5. **Remediation Roadmap**: Step-by-step technical fix roadmap with effort and impact ratings.
  6. **Content Visibility**: Measure text availability before and after JavaScript hydration.
  7. **AI Visibility**: Brand appearance rate in AI search summaries and generative responses.
  8. **Your Cited Pages**: Pages cited as sources in generative answers.
  9. **Cited Sources**: External third-party sources and competitor domains cited by AI answers.
  10. **Brand Claims**: Sentiments (favorable, neutral, unfavorable) and specific statements made by AI about your brand.
  11. **Off-site Presence**: External citation footprint, directory citations, and profile completeness.
  12. **Prompt Set**: Breakdown of 37+ audited queries across comparative, brand, informational, and transactional intents.
  13. **Crawl**: Telemetry, cache hit rate, robot directives, crawl elapsed time, and engine indexing stats.
- **Page Detail Screen (`pages.html` / `page-detail.html`)**:
  - **Issues Tab**: 12-column page inspection table with color-coded severity badges (`critical`, `high`, `medium`, `low`, `meets target ✓`).
  - **Actions 9 Tab**: 9 actionable fixes with current state (`NOW`), target state (`SHOULD BE`), resolution steps (`HOW`), copyable code snippets (`EXAMPLE`), and affected URLs (`PAGES`).
- **Interactive Audit Launcher (`index.html`)**: Configure site URLs, competitor domains, target markets, max page crawls, and optional GEO Gemini Grounded probes.

---

## 🛠 Tech Stack

- **Frontend**: Semantic HTML5, Tailwind CSS, Lucide Icons, Vanilla JavaScript.
- **Design System**: Dual-mode support (Light & Dark), responsive glassmorphic cards, custom segmented capsule navigation.
- **Backend / Delivery**: Static web-compatible, micro-service ready.

---

## 💻 Quick Start

To run the platform locally:

```bash
# Clone the repository
git clone https://github.com/komalpreetkaur-ai/Auralytix.git

# Navigate to directory
cd Auralytix

# Start a local web server (e.g. Python)
python3 -m http.server 5555

# Open in your browser
open http://localhost:5555/
```
