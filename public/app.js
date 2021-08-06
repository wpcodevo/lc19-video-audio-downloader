import express from "express";
import slugify from "slugify";
import ytdl from "ytdl-core";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.static("public"));

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
