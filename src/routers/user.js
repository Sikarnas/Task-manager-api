const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendEmail } = require("../emails/account");
const logAll = require("../middleware/logMiddleware")

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  }
});

userRouter.post(
  "/users/me/avatar",
  auth, logAll,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

userRouter.delete("/users/me/avatar", logAll,auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

userRouter.get("/users/:id/avatar",logAll, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

userRouter.post("/users",logAll, async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendEmail(user.email, user.name, "welcome");
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post("/users/login",logAll, async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.post("/users/logout",logAll, auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.post("/users/logoutAll",logAll, auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.get("/users/me",logAll, auth, async (req, res) => {
  res.send(req.user);
});

// userRouter.get(`/users/:id`, async (req,res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

userRouter.patch("/users/me",logAll, auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every(update => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
    const user = await User.findById(req.user._id);

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.delete("/users/me",logAll, auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)

    // if(!user) {
    //     return res.status(404).send()
    // }
    console.log(req.user);
    await req.user.remove();
    sendEmail(req.user.email, req.user.name, "cancelation");
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = userRouter;
