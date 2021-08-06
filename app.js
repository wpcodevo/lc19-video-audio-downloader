const express = require("express");
const slugify = require("slugify");
const ytdl = require("ytdl-core");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 6000;
const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.listen(
  PORT,
  console.log(
    `Server started successfully in ${process.env.NODE_ENV} on ${PORT}`
  )
);

app.use(express.static("public"));

app.get("/video/:video", async (req, res) => {
  try {
    var url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }
    let info = await ytdl.getInfo(url);
    res.send("it worked");
    const title = slugify(info.videoDetails.title, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: false,
    });
    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(url, {
      format: "mp4",
      quality: "highest",
    }).pipe(res);
  } catch (err) {
    console.error(err);
  }
});
