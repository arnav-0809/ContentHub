const express = require("express");
const app = express();
const router = express.Router();
const { parse } = require("fast-csv");
const contentModel = require("../Models/contentModel");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post(
  "/postTitleAndStory",
  upload.single("contentFile"),
  async (req, res) => {
    const { user_id } = req.body;
    const getUserUrl = "/getUser";
    var foundUser = false;
    try {
      const res = await axios.get(process.env.userRestUrl + getUserUrl, {
        params: { user_id: user_id },
      });

      if (res.data.code === 200) {
        if (res.data.user._id) {
          foundUser = true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    if (req.file && foundUser) {
      const date = new Date();
      const date_published = date.toISOString();
      const csvFilePath = req.file.path;
      const stream = fs.createReadStream(csvFilePath);
      stream
        .pipe(parse({ headers: false }))
        .on("data", (data) => {
          var results = [];
          data.forEach((ele) => {
            results.push(ele);
          });
          var content = new contentModel({
            user_id: user_id,
            title: results[0],
            story: results[1],
            date_published: date_published,
          });
          content.save((err) => {
            if (err) {
              console.error(err);
            }
          });
        })
        .on("end", () => {
          console.log("End of content import");
        });

      res.json({
        code: 200,
        errCode: null,
        message: "Content saved",
      });
    } else {
      if (foundUser) {
        res.json({
          message: "not a csv file",
        });
      } else {
        res.json({
          message: "not a valid user",
        });
      }
    }
  }
);

module.exports = router;
