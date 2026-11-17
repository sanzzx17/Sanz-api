export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt kosong' });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        // Gemini punya endpoint kompatibel OpenAI, jadi formatnya sama
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gemini-2.0-flash", // Model gratis yang cepet
                messages: [
                    { role: "system", content: "Kamu adalah SANZ AI, asisten pintar yang jawabannya singkat dan jelas." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
}
