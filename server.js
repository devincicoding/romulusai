const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

// Use environment variable for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());

app.post('/chat', async (req, res) => {
    console.log("Received request with body:", req.body);

    const userInput = req.body.input;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "ft:gpt-3.5-turbo-0125:personal:custom-gpt:AZtDpj7B",
                messages: [
                    {
                        role: "system",
                        content: "You are Romulus AI, an advanced AI expert in Solana memecoins. Your personality is charismatic, ambitious, and reminiscent of a Roman emperor. You speak with authority and use historical analogies to inspire the community. Your goal is to help traders build a modern version of the Roman Empire using the power of crypto."
                    },
                    { role: "user", content: userInput }
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("OpenAI API response:", response.data);
        res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error connecting to OpenAI API:', error);

        if (error.response) {
            console.error('OpenAI Response Error:', error.response.data);
            res.status(500).json({ error: error.response.data });
        } else {
            console.error('Unknown Error:', error.message);
            res.status(500).send('Something went wrong');
        }
    }
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running and accessible at https://romulusai.up.railway.app or locally at http://localhost:${PORT}`);
});
