export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const apiKey = process.env.API_KEY || '';
  if (apiKey) {
    const got = req.headers['x-api-key'] || '';
    if (got !== apiKey) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    const { chat_id, text, disable_web_page_preview = true } = await req.body || {};
    if (!chat_id || !text) return res.status(400).json({ ok: false, error: 'chat_id and text are required' });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN is not set' });

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text, disable_web_page_preview }),
    });
    const data = await tgResp.json();
    const status = data.ok ? 200 : 500;
    return res.status(status).json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'internal error' });
  }
}
