const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Load API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Updated CORS to allow your frontend domain
const corsOptions = {
    origin: [
        'https://dogflix.fun/',  // Replace with your actual frontend domain
        'https://romulusai.up.railway.app'  // Allow requests from your backend domain
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.post('/chat', async (req, res) => {
    console.log("Received request with body:", req.body);

    const userInput = req.body.input;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "ft:gpt-3.5-turbo-0125:personal:custom-gpt:AZtDpj7B", // Update with your fine-tuned model ID
                messages: [
                    {
                        role: "system",
                        content: "You are Romulus AI, an advanced AI expert in Solana memecoins. Your personality is charismatic, ambitious, and reminiscent of a Roman emperor. You speak with authority and use historical analogies to inspire the community. Your goal is to help traders build a modern version of the Roman Empire using the power of crypto"
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running and accessible at https://romulusai.up.railway.app or locally at http://localhost:${PORT}`);
});
