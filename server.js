// File: server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Environment variable for sensitive information
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// CORS configuration
const corsOptions = {
    origin: [
        'https://dogflix.fun',          // Frontend domain
        'https://www.dogflix.fun',     // Alternative frontend domain
        'http://localhost:3000',       // Local development frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable cookies or credentials if needed
};

// Apply CORS middleware first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight requests

// JSON body parser middleware
app.use(express.json());

// Fallback middleware to ensure CORS headers are sent
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // Send a quick response for preflight
    }
    next();
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const userInput = req.body.input; // Input from the user

    console.log("Received input from user:", userInput);

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "ft:gpt-3.5-turbo-0125:personal:custom-gpt:AZtDpj7B", // Replace with your fine-tuned model ID
                messages: [
                    {
                        role: "system",
                        content: "You are Romulus AI, an advanced AI expert in Solana memecoins. Your personality is charismatic, ambitious, and reminiscent of a Roman emperor. Your goal is to help traders build a modern version of the Roman Empire using the power of crypto.",
                    },
                    { role: "user", content: userInput },
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

        console.log("Response from OpenAI:", response.data);

        // Send response back to the frontend
        res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error connecting to OpenAI:', error.message);

        if (error.response) {
            console.error('OpenAI API Error:', error.response.data);
            res.status(500).json({ error: error.response.data });
        } else {
            res.status(500).send('An error occurred while processing your request.');
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running and accessible at https://romulusai.up.railway.app or locally at http://localhost:${PORT}`);
});
