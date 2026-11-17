export default async function handler(req, res) {
    // 1. Cek method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Ambil prompt dari body
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Prompt kosong' });

    // 3. Ambil API Key dari Vercel
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // 4. Proses nembak ke Groq
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                // Model paling stabil & gratis di Groq saat ini
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        
        // Kalau Groq ngasih error (misal key salah), tampilin pesannya
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Kalau sukses, balikin jawaban AI
        res.status(200).json({ reply: data.choices[0].message.content });
        
    } catch (error) {
        // Kalau koneksi ke Groq putus/error
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
}
