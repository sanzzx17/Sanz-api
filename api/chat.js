// File: api/chat.js
export default async function handler(req, res) {
    // Cuma terima request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt kosong' });
    }

    // ⚠️ Kunci API lu diambil dari Environment Variable Vercel (bukan ditulis disini)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Model paling murah & cepet
                messages: [
                    { role: "system", content: "Kamu adalah SANZ AI, asisten pintar yang jawabannya singkat, jelas, dan to the point." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Balikin jawaban AI ke Flutter
        const reply = data.choices[0].message.content;
        res.status(200).json({ reply: reply });

    } catch (error) {
        res.status(500).json({ error: 'Gagal konek ke OpenAI: ' + error.message });
    }
}
