const express = require("express");
const router = express.Router();
const contentModel = require("../Models/contentModel");
const axios = require("axios");

router.get("/newContent", async (req, res) => {
  const newContent = await contentModel.find().sort({ date_published: -1 });
  res.json({
    newContent: newContent,
  });
});

router.get("/topLikedContent", async (req, res) => {
  const getContentUrl = "/getUserLikedContent";
  var getUserInteractedContent = [];
  try {
    const response = await axios.get(
      process.env.userInteractionUrl + getContentUrl
    );
    if (response.status === 200) {
      if (response.data) {
        for (var i in response.data.content) {
          getUserInteractedContent.push(response.data.content[i].content_id);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  await contentModel
    .find({ _id: { $in: getUserInteractedContent } }, (err, content) => {
      if (err) {
        console.error(err);
      }

      content.sort(
        (a, b) =>
          getUserInteractedContent.findIndex((id) => a._id.equals(id)) -
          getUserInteractedContent.findIndex((id) => b._id.equals(id))
      );

      res.json({
        topLikedContent: content,
      });
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

router.get("/topReadContent", async (req, res) => {
  const getContentUrl = "/getUserReadContent";
  var getUserInteractedContent = [];
  try {
    const response = await axios.get(
      process.env.userInteractionUrl + getContentUrl
    );
    if (response.status === 200) {
      if (response.data) {
        for (var i in response.data.content) {
          getUserInteractedContent.push(response.data.content[i].content_id);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  await contentModel
    .find({ _id: { $in: getUserInteractedContent } }, (err, content) => {
      if (err) {
        console.error(err);
      }

      content.sort(
        (a, b) =>
          getUserInteractedContent.findIndex((id) => a._id.equals(id)) -
          getUserInteractedContent.findIndex((id) => b._id.equals(id))
      );

      res.json({
        topReadContent: content,
      });
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

module.exports = router;
