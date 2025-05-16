const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
