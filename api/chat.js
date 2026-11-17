export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt kosong' });

    // Ambil API Key dari Environment Variable Vercel
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Model gratis dari Meta
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
