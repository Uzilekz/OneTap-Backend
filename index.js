const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Endpoint para obtener videos de un canal (ya existente)
app.get("/api/youtube", async (req, res) => {
    const channelId = req.query.channelId;

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
        res.status(500).json({ error: "Error fetching data from YouTube" });
    }
});

// Nuevo endpoint para obtener detalles de un video por ID
app.get("/api/youtubeVideo", async (req, res) => {
    const videoId = req.query.id;

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
        res.status(500).json({
            error: "Error fetching video details from YouTube",
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
