const express = require("express");
const router = express.Router();
const contentModel = require("../Models/contentModel");

router.post("/deleteContent", async (req, res) => {
  const { id } = req.body;
  const deleted = await contentModel
    .deleteOne({ _id: id }, (err) => {
      if (err) {
        console.error(err);
        return res.json({
          code: 500,
          errCode: null,
          message: "Internal Server error",
        });
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  if (deleted.deletedCount) {
    res.json({
      code: 200,
      errCode: null,
      message: "Content deleted",
    });
  } else {
    res.json({
      message: "Content not found",
    });
  }
});

router.get("/getContent", async (req, res) => {
  const { id } = req.query;
  await contentModel
    .findOne({ _id: id }, (err, content) => {
      if (err) {
        console.error(err);
        return res.json({
          code: 500,
          errCode: 500,
          message: "Internal Server error",
        });
      }
      if (content) {
        res.json({
          code: 200,
          errCode: null,
          message: "Content Found",
          user: content,
        });
      } else {
        res.json({
          message: "Content not found",
        });
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

router.post("/updateContent", async (req, res) => {
  const { id, title, story } = req.body;
  contentModel.findOne({ _id: id }, (err, content) => {
    if (err) {
      console.error(err);
    }
    if (content) {
      if (title) {
        const date = new Date();
        const date_published = date.toISOString();
        contentModel.updateOne(
          { _id: id },
          { $set: { title: title, date_published: date_published } },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      if (story) {
        const date = new Date();
        const date_published = date.toISOString();
        contentModel.updateOne(
          { _id: id },
          { $set: { story: story, date_published: date_published } },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
      res.json({
        code: 200,
        errCode: null,
        message: "Content updated",
      });
    } else {
      res.json({
        message: "Content not found",
      });
    }
  });
});

module.exports = router;
