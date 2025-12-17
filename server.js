const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("reddit.com")) {
    return res.status(400).json({ error: "Invalid Reddit URL" });
  }

  const output = "reddit-video.mp4";
  const cmd = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 "${url}" -o ${output}`;

  exec(cmd, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Download failed" });
    }

    res.download(output);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
