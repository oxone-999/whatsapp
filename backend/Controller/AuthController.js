import UserModal from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, password} = req.body;

    const user = await UserModal.findOne({ username: username });
    if (user) {
      res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModal({
      username: username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        username: newUser.username,
        id: newUser._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const savedUser = await newUser.save();
    res.status(200).json({ status: "ok", user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: "Error creating user" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModal.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "24h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
