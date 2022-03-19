const express = require("express");
const router = express.Router();
const userModel = require("../Models/userModel");

router.post("/createUser", async (req, res) => {
  const newUser = new userModel(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.error(err);
      return res.json({
        code: err.code,
        errCode: null,
        message: "Duplication of Phone number or email",
      });
    } else {
      res.json({
        code: 200,
        errCode: null,
        message: "User Created",
        user: user,
      });
    }
  });
});

router.post("/deleteUser", async (req, res) => {
  const { phone_number } = req.body;
  const deleted = await userModel
    .deleteOne({ phone_number: phone_number }, (err, user) => {
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
      message: "user deleted",
    });
  } else {
    res.json({
      message: "user not found",
    });
  }
});

router.get("/getUser", async (req, res) => {
  const { user_id } = req.query;
  await userModel
    .findOne({ _id: user_id }, (err, user) => {
      if (err) {
        console.error(err);
        return res.json({
          code: 500,
          errCode: null,
          message: "Internal Server error",
        });
      }
      if (user) {
        res.json({
          code: 200,
          errCode: null,
          message: "userFound",
          user: user,
        });
      } else {
        res.json({
          message: "user not found",
        });
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

router.post("/updateUser", async (req, res) => {
  const { phone_number, first_name, last_name, email_id } = req.body;
  userModel.findOne({ phone_number: phone_number }, (err, user) => {
    if (err) {
      console.error(err);
    }
    if (user) {
      if (first_name) {
        userModel.updateOne(
          { _id: user._id },
          { $set: { first_name: first_name } },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      if (last_name) {
        userModel.updateOne(
          { _id: user._id },
          { $set: { last_name: last_name } },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }

      if (email_id) {
        userModel.updateOne(
          { _id: user._id },
          { $set: { email_id: email_id } },
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
        message: "User updated",
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  });
});

module.exports = router;
