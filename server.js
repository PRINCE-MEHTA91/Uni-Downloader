const express = require("express");
const path = require("path");
const cors = require("cors");
const YTDlpWrap = require("yt-dlp-wrap").default;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ytDlp = new YTDlpWrap();
ytDlp.getVersion().catch(async () => {
    console.log("Downloading yt-dlp...");
    await YTDlpWrap.downloadFromGithub();
});

// ================= VIDEO INFO =================

app.post("/video-info", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "Video URL required" });
    }

    try {
        const metadata = await ytDlp.getVideoInfo(url);
        res.json(metadata);
    } catch (error) {
        console.error("yt-dlp error:", error);
        res.status(500).json({ error: "Failed to fetch video information" });
    }
});


// ================= DOWNLOAD =================

app.get("/download", async (req, res) => {
    const { url, formatId } = req.query;

    if (!url || !formatId) {
        return res.status(400).send("Missing parameters");
    }

    try {
        const metadata = await ytDlp.getVideoInfo(url);
        const title = metadata.title.replace(/[^a-z0-9]/gi, "_");
        const filename = `${title}.mp4`;

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "video/mp4");

        // ✅ FIX: use execStream instead of spawn + path
        const stream = ytDlp.execStream([
            "-f", formatId,
            "-o", "-",
            url
        ]);

        stream.pipe(res);

        stream.on("error", (err) => {
            console.error("Stream error:", err);
            res.end();
        });

    } catch (error) {
        console.error("Download error:", error);
        if (!res.headersSent) {
            res.status(500).send("Download failed");
        }
    }
});


// ================= SERVER =================

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});