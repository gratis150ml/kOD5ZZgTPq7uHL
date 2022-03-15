const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");
var crypt = require("crypto");
const { check, validationResult } = require("express-validator");
const connect = async () => {
  await mongoose
    .connect("mongodb://:@localhost:27017/")
    .catch((error) => console.log(error));
};
connect();
const app = express();
app.use(cors());
app.use(express.json());
const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    rank: { type: Number, default: 0 },
    code: { type: String },
    active: { type: Boolean, default: false },
    is_banned: { type: Boolean, default: false },
    description: { type: String, default: "empty" },
    expires: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
  { collection: "users" }
);
const Post = new mongoose.Schema(
  {
    owner: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    views: { type: Number, default: 0 },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
  { collection: "posts" }
);
const model2 = mongoose.model("Post", Post);
const model = mongoose.model("User", User);
app.post("/v1/users/refresh_token", async (request, response) => {
  try {
    const token = request.headers["authorization"];
    if (!token) {
      return response
        .status(401)
        .json({ status: "validation_error", message: "missing token" });
    } else {
      jwt.verify(token, "123456", (error, user) => {
        if (error) {
          console.log(error);
          return response
            .status(401)
            .json({ status: "validation_error", message: "invalid token" });
        } else {
          const newacesstoken = jwt.sign({ id: user.id }, "12345", {
            expiresIn: "1d",
          });
          const newrefreshtoken = jwt.sign({ id: user.id }, "123456", {
            expiresIn: "7d",
          });
          return response.status(200).json({
            status: "ok",
            new_token: newacesstoken,
            new_refresh_token: newrefreshtoken,
          });
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post(
  "/v1/users/register",
  [check("email").isEmail()],
  async (request, response) => {
    try {
      const { email, username, password } = request.body;
      if (!password && !username && !email) {
        return response.status(400).json({
          status: "validation_error",
          message: "missing password, email, username",
        });
      }
      if (!email) {
        return response.status(400).json({
          status: "validation_error",
          message: "email is required",
        });
      } else {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          return response
            .status(400)
            .json({ status: "error", message: "invalid email" });
        }
      }
      if (!password) {
        return response.status(400).json({
          status: "validation_error",
          message: "password is required",
        });
      } else {
        if (password.length > 72) {
          return response.status(400).json({
            status: "validation_error",
            message: "password is too long",
          });
        } else {
          const uppercase = /[A-Z]+/;
          const lowercase = /[a-z]+/;
          const numbers = /[0-9]+/;
          const special = /[\W]+/;
          if (
            !uppercase.test(password) ||
            !numbers.test(password) ||
            !lowercase.test(password) ||
            !special.test(password) ||
            password.length < 16
          ) {
            return response.status(400).json({
              status: "validation_error",
              message:
                "the password must be at least 16 characters long and contain uppercase and lowercase letters, digits and special characters.",
            });
          }
        }
      }
      if (!username) {
        return response.status(400).json({
          status: "validation_error",
          message: "username is required",
        });
      } else {
        if (username.length < 4) {
          return response.status(400).json({
            status: "validation_error",
            message: "username is too short",
          });
        } else {
          if (username.length > 15) {
            return response.status(400).json({
              status: "validation_error",
              message: "username is too long",
            });
          }
        }
        if (!/^[a-z0-9]+$/i.test(username)) {
          return response.status(400).json({
            status: "validation_error",
            message: "the username can contain only letters and numbers.",
          });
        }
        const user = await model.findOne({ username: username });
        if (user) {
          return response.status(500).json({
            status: "validation_error",
            message: "username already exists",
          });
        }
      }
      const hashed_password = await bcrypt.hash(password, 10);
      const user = await model.create({
        username: username,
        password: hashed_password,
        email: email,
        code: crypt.randomUUID(),
      });
      if (user) {
        const acesstoken = jwt.sign({ id: user.id }, "12345", {
          expiresIn: "1d",
        });
        const refreshtoken = jwt.sign({ id: user.id }, "123456", {
          expiresIn: "7d",
        });
        return response.status(200).json({
          status: "ok",
          token: acesstoken,
          refresh_token: refreshtoken,
        });
      }
    } catch (err) {
      return response
        .status(500)
        .json({ status: "error", message: err.message });
    }
  }
);
app.post("/v1/users/login", async (request, response) => {
  try {
    const { password, username } = request.body;
    if (!password && !username) {
      return response.status(400).json({
        status: "validation_error",
        message: "missing password and username",
      });
    }
    if (!password) {
      return response.status(400).json({
        status: "validation_error",
        message: "where is the password m8",
      });
    }
    if (!username) {
      return response.status(400).json({
        status: "validation_error",
        message: "where is the username m8",
      });
    }
    const user = await model.findOne({ username });
    if (!user) {
      return response.status(400).json({
        status: "validation_error",
        message: "username doesnt exist",
      });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return response.status(400).json({
          status: "validation_error",
          message: "wrong password",
        });
      } else {
        const firstacesstoken = jwt.sign({ id: user.id }, "12345", {
          expiresIn: "1d",
        });
        const firstrefreshtoken = jwt.sign({ id: user.id }, "123456", {
          expiresIn: "7d",
        });
        return response.status(200).json({
          status: "ok",
          token: firstacesstoken,
          refresh_token: firstrefreshtoken,
        });
      }
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
const auth = (request, response, next) => {
  try {
    const token = request.headers["authorization"];
    if (!token) {
      return response.status(401).json({
        status: "validation_error",
        message: "missing validation token",
      });
    } else {
      jwt.verify(token, "12345", (error) => {
        if (error) {
          console.log(error);
          return response
            .status(401)
            .json({ status: "validation_error", message: "invalid token" });
        } else {
          next();
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
};
const admin = async (request, response, next) => {
  try {
    const token111 = request.headers["authorization"];
    if (!token111) {
      return response.status(401).json({
        status: "validation_error",
        message: "missing validation token",
      });
    } else {
      jwt.verify(token111, "12345", (error) => {
        if (error) {
          console.log(error);
          return response
            .status(401)
            .json({ status: "validation_error", message: "invalid token" });
        } else {
          jwt.verify(token111, "12345", async (error, use23r) => {
            const adm = await model.findOne({ _id: use23r.id });
            if (!adm) {
              return response.status(400).json({
                status: "error",
                message: "user doesnt exist anymore",
              });
            }
            if (adm.rank === 1) {
              next();
            } else {
              return response
                .status(400)
                .json({ status: "error", message: "access denied" });
            }
          });
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
};
app.get("/v1/admin", admin, async (request, response) => {
  try {
    return response.status(200).json({ status: "ok", message: "secret shit" });
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/v1/user/activate/:id", async (request, response) => {
  try {
    if (!request.params.id) {
      return response
        .status(400)
        .json({ status: "error", message: "code required" });
    } else {
      const user829 = await model.findOne({ code: request.params.id });
      if (!user829) {
        return response
          .status(400)
          .json({ status: "error", message: "wrong code" });
      } else {
        const expiresIn = 1000 * 60 * 60 * 60 * 24;
        if (Date.now() - user829.expires > expiresIn) {
          await user829.remove();
          return response
            .status(400)
            .json({ status: "error", message: "code expired" });
        } else {
          user829.active = true;
          user829.save();
          return response
            .status(200)
            .json({ status: "ok", message: "user activated" });
        }
      }
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/v1/user/info", auth, async (request, response) => {
  try {
    const token1125 = request.headers["authorization"];
    jwt.verify(token1125, "12345", async (error, use23rr) => {
      const ys75 = await model
        .findOne({ _id: use23rr.id })
        .select("-expires")
        .select("-code")
        .select("-password")
        .select("-__v");
      if (!ys75) {
        return response.status(400).json({
          status: "error",
          message: "user doesnt exist anymore",
        });
      } else {
        return response.status(400).json({
          status: "ok",
          data: ys75,
        });
      }
    });
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post("/v1/user/change_username", auth, async (request, response) => {
  try {
    const token11251 = request.headers["authorization"];
    if (!request.body.username) {
      return response
        .status(400)
        .json({ status: "error", message: "username required" });
    } else {
      if (request.body.username.length < 4) {
        return response.status(400).json({
          status: "validation_error",
          message: "username is too short",
        });
      } else {
        if (request.body.username.length > 15) {
          return response.status(400).json({
            status: "validation_error",
            message: "username is too long",
          });
        }
      }
      if (!/^[a-z0-9]+$/i.test(request.body.username)) {
        return response.status(400).json({
          status: "validation_error",
          message: "the username can contain only letters and numbers.",
        });
      }
      const ejif = request.body.username;
      const user145 = await model.findOne({ username: ejif });
      if (user145) {
        return response.status(500).json({
          status: "validation_error",
          message: "username already exists",
        });
      }
      jwt.verify(token11251, "12345", async (error, us2e23rr) => {
        const ys751 = await model.findByIdAndUpdate(
          us2e23rr.id,
          { username: request.body.username },
          {
            new: true,
          }
        );
        if (!ys751) {
          return response.status(400).json({
            status: "error",
            message: "user doesnt exist anymore",
          });
        } else {
          return response.status(200).json({
            status: "ok",
            message: "username changed",
          });
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.post("/v1/user/change_description", auth, async (request, response) => {
  try {
    const token112511 = request.headers["authorization"];
    if (!request.body.description) {
      return response
        .status(400)
        .json({ status: "error", message: "description required" });
    } else {
      if (request.body.description.length < 4) {
        return response.status(400).json({
          status: "validation_error",
          message: "description is too short",
        });
      } else {
        if (request.body.description.length > 100) {
          return response.status(400).json({
            status: "validation_error",
            message: "description is too long",
          });
        }
      }
      if (!/^[a-z0-9]+$/i.test(request.body.description)) {
        return response.status(400).json({
          status: "validation_error",
          message: "the description can contain only letters and numbers.",
        });
      }
      jwt.verify(token112511, "12345", async (error, us2e23rrr) => {
        const ys7511 = await model.findByIdAndUpdate(
          us2e23rrr.id,
          { description: request.body.description },
          {
            new: true,
          }
        );
        if (!ys7511) {
          return response.status(400).json({
            status: "error",
            message: "user doesnt exist anymore",
          });
        } else {
          return response.status(400).json({
            status: "ok",
            message: "description changed",
          });
        }
      });
    }
  } catch (err) {
    return response.status(500).json({ status: "error", message: err.message });
  }
});
app.listen(8080, (er) => {
  if (er) {
    console.log(er);
  } else {
    console.log("running...");
  }
});
