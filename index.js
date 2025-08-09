const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

console.log(process.env.YOUTUBE_API_KEY);

// --- CORS ---
const allowedOrigins = [
    "http://localhost:3000", // desarrollo local
    "https://onetap-esports.netlify.app", // producción en Netlify
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET,POST",
        allowedHeaders: "Content-Type,Authorization",
    })
);

const PORT = process.env.PORT || 5000;

// --- Endpoint para obtener videos de un canal ---
app.get("/api/youtube", async (req, res) => {
    const channelId = req.query.channelId;

    if (!channelId) {
        return res.status(400).json({ error: "channelId es requerido" });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search`,
            {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    channelId,
                    part: "snippet",
                    order: "date",
                    maxResults: 5,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching YouTube data:", error.message);
        res.status(500).json({ error: "Error fetching data from YouTube" });
    }
});

// --- Endpoint para obtener detalles de un video ---
app.get("/api/youtubeVideo", async (req, res) => {
    const videoId = req.query.id;

    if (!videoId) {
        return res.status(400).json({ error: "id de video es requerido" });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    id: videoId,
                    part: "snippet,contentDetails",
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching video details:", error.message);
        res.status(500).json({
            error: "Error fetching video details from YouTube",
        });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
