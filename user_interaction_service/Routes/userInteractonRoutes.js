const express = require("express");
const router = express.Router();
const userInteractionModel = require("../Models/userInteractionModel");
const axios = require("axios");

router.post("/contentReadEvent", async (req, res) => {
  const { content_id, user_id } = req.body;
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

  if (foundUser) {
    await userInteractionModel
      .findOne({ content_id: content_id }, (err, content) => {
        if (err) {
          console.error(err);
          return res.json({
            code: 500,
            errCode: null,
            message: "Internal Server error",
          });
        }
        if (content) {
          var userIdFound = false;
          content.reads.find((e) => {
            if (e === user_id) {
              userIdFound = true;
            }
          });
          if (!userIdFound) {
            var reads = content.reads.concat(user_id);
            var reads_count = content.reads_count + 1;
            userInteractionModel.updateOne(
              { _id: content._id },
              {
                $set: {
                  reads: reads,
                  reads_count: reads_count,
                },
              },
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  res.json({
                    code: 200,
                    errCode: null,
                    message: "Read Event Successful",
                  });
                }
              }
            );
          } else {
            res.json({
              message: "User already read the content",
            });
          }
        } else {
          const newUserInteraction = new userInteractionModel({
            user_id: user_id,
            content_id: content_id,
            likes: [],
            reads: [user_id],
            reads_count: 1,
            likes_count: 0,
          });
          newUserInteraction.save((err, userInteraction) => {
            if (err) {
              console.error(err);
              return res.json({
                code: 500,
                errCode: 500,
                message: "Internal Server Error",
              });
            } else {
              res.json({
                code: 200,
                errCode: null,
                message: "Read Event Successful",
                userInteraction: userInteraction,
              });
            }
          });
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  } else {
    res.json({
      message: "User does not exist",
    });
  }
});

router.post("/contentLikeEvent", async (req, res) => {
  const { content_id, user_id } = req.body;
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

  if (foundUser) {
    await userInteractionModel
      .findOne({ content_id: content_id }, (err, content) => {
        if (err) {
          console.error(err);
          return res.json({
            code: 500,
            errCode: null,
            message: "Internal Server error",
          });
        }
        if (content) {
          var userIdFound = false;
          content.likes.find((e) => {
            if (e === user_id) {
              userIdFound = true;
            }
          });
          if (!userIdFound) {
            var likes = content.likes.concat(user_id);
            var likes_count = content.likes_count + 1;
            userInteractionModel.updateOne(
              { _id: content._id },
              {
                $set: {
                  likes: likes,
                  likes_count: likes_count,
                },
              },
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  res.json({
                    code: 200,
                    errCode: null,
                    message: "Like Event Successful",
                  });
                }
              }
            );
          } else {
            res.json({
              message: "User already liked the content",
            });
          }
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  } else {
    res.json({
      message: "User does not exist",
    });
  }
});

router.get("/getUserReadContent", async (req, res) => {
  const content = await userInteractionModel.find().sort({ reads_count: -1 });
  res.json({
    content: content,
  });
});

router.get("/getUserLikedContent", async (req, res) => {
  const content = await userInteractionModel.find().sort({ likes_count: -1 });
  res.json({
    content: content,
  });
});

module.exports = router;
