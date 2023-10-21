import UserModal from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const registerUser = async(req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const newUser = new UserModal(req.body);
    const { username } = req.body;
    try {
        const olduser = await UserModal.findOne({ username });
        if (olduser) {
            return res.status(400).json({ message: "Username already registered !" });
        }
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username,
            id: user._id
        }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModal.findOne({ username: username });

        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json("wrong password");
            } else {
                const token = jwt.sign({ username: user.username, id: user._id },
                    process.env.JWT_KEY, { expiresIn: "24h" }
                );
                res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
}