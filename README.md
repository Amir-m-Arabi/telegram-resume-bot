# Telegram Résumé Bot

> **A lightweight Cloudflare Worker + [grammY](https://grammy.dev) Telegram bot** that showcases a résumé (Persian & English), lists GitHub projects, and accepts contact info – all through an inline-keyboard driven chat flow.

---

## ✨ Features

| Feature                  | Description                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 📄 Résumé download       | Sends either the Persian (`resume_fa`) or English (`resume_en`) PDF stored on Telegram via `file_id`, so no extra hosting is required.       |
| 🗂 GitHub project list    | Fetches public repositories for a given username using the GitHub REST API and presents them as buttons; selecting one returns the repo URL. |
| 💬 Two-step contact form | Collects name ➜ email and stores them in **Cloudflare KV** using grammY sessions.                                                            |
| ⚡️ Serverless & fast    | Runs entirely on a single Cloudflare Worker (< 1 ms cold-start).                                                                             |
| 🔒 Stateless by design   | All user state lives in KV; no runtime file system or DB.                                                                                    |
| 🛠 Fully-typed            | End-to-end TypeScript with strict compiler options.                                                                                          |

---

## 🏗 Architecture overview

```
+-------------+              +-------------------+
|  Telegram   |  Webhook ➜   | Cloudflare Worker |
+------+------+              +--+----------------+
       |                         |
       |  grammY Bot             |  Cloudflare KV (sessions)
       |  ├── /start             |
       |  ├── resume handlers    |
       |  ├── projects handlers  |
       |  └── contact flow       |
       |                         |
       +-------------------------+
```

```
src/
├─ cloudflare/worker.ts          # Worker entrypoint & routing
├─ shared/
│  ├─ commands/                  # High-level commands (/start, /contact)
│  └─ session/                   # Session model & KV adapter
└─ node/
   ├─ helpers/                   # Inline-menu & step handlers
   └─ services/                  # External integrations (GitHub)
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Amir-m-Arabi/telegram-resume-bot.git
cd telegram-resume-bot
npm install
```

### 2. Create your KV namespace

```bash
wrangler kv:namespace create SESSIONS
```

Copy the returned **id** into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id      = "<your-kv-id>"
```

### 3. Configure secrets & vars

```bash
# Telegram bot token
wrangler secret put BOT_TOKEN

# Telegram file_id for the résumé PDFs
wrangler secret put RESUME_FA_ID
wrangler secret put RESUME_EN_ID

# (optional) GitHub username override
wrangler secret put GITHUB_USERNAME "Amir-m-Arabi"
```

### 4. Local development

```bash
wrangler dev --port 8787
```

Send a test update:

```bash
curl -X POST "http://127.0.0.1:8787" \
     -H "Content-Type: application/json" \
     --data '{"update_id":0,"message":{"message_id":0,"date":0,"chat":{"id":123,"type":"private"},"text":"/start"}}'
```

### 5. Deploy

```bash
wrangler deploy
```

### 6. Set the Telegram webhook

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -d "url=https://<your-worker-subdomain>.workers.dev"
```

---

## ⚙️ Configuration reference

| Key / Var                           | Where           | Purpose                                                     |
| ----------------------------------- | --------------- | ----------------------------------------------------------- |
| **BOT_TOKEN**                       | Secret          | Telegram bot token from BotFather                           |
| **RESUME_FA_ID** / **RESUME_EN_ID** | Secret          | `file_id` for the Persian/English résumé documents          |
| **GITHUB_USERNAME**                 | Var/Secret      | GitHub user to fetch repos for (defaults to author)         |
| **SESSIONS**                        | `kv_namespaces` | Cloudflare KV namespace used by the bot for session storage |

---

## 📦 Scripts

```bash
npm install   # installs dependencies
npm run start # (coming soon) run with ts-node locally
```

---

## 🤖 Try the Bot

👉 [Open the Telegram bot](https://t.me/tel_resumeBot)

---

## 🤝 Contributing

Pull requests are welcome! If you find a bug or have an idea, open an issue.

---

## 📜 License

[MIT](LICENSE)
