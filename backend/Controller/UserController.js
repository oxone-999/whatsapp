import UserModal from "../Model/UserModel.js";
import bcrypt, { hash } from 'bcrypt';
import jwt from "jsonwebtoken";

export const getAllUser = async(req, res) => {
    try {
        let users = await UserModal.find();
        users = users.map((user) => {
            const { password, ...otherdetails } = user._doc;
            return otherdetails;
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getUser = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModal.findById(id);
        if (user) {
            const { password, ...otherdetails } = user._doc;
            res.status(200).json(otherdetails);
        } else {
            res.status(404).json("User does not exist");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async(req, res) => {
    const id = req.params.id;
    const { _id, currentUserAdminStatus, password } = req.body;
    if (id === _id) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModal.findByIdAndUpdate(id, req.body, { new: true });
            const token = jwt.sign({
                username: user.username,
                _id: _id
            }, process.env.JWT_KEY, { expiresIn: "24hr" })
            res.status(200).json({ user, token });

        } catch (error) {
            res.status(500).json({ message: error.message });

        }
    } else {
        res.status(403).json("Access Denied !!");
    }

}

export const deleteUser = async(req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await UserModal.findByIdAndDelete(id);
            res.status(200).json("User deleted successfuly");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json("Access Denied !!");

    }
}

export const followUser = async(req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Access Denied !!");
    } else {
        try {
            const followUser = await UserModal.findById(id);
            const followingUser = await UserModal.findById(_id);
            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json("User followed successfuly");

            } else {
                res.status(403).json("User already followed by you");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });

        }
    }
}


export const unfollowUser = async(req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Access Denied !!");
    } else {
        try {
            const followUser = await UserModal.findById(id);
            const followingUser = await UserModal.findById(_id);
            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json("User unfollowed successfuly");

            } else {
                res.status(403).json("User not followed by you");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });

        }
    }
}

export const getCount = async(req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    if (_id == id) {
        return res.status(403).json("Denied");
    } else {
        try {
            const user = await UserModal.findById(id);
            const adduser = await UserModal.findById(_id);
            // console.log(adduser);
            console.log(!adduser.ViewAll.includes(id))
            if (!adduser.ViewAll.includes(id)) {
                await adduser.updateOne({ $push: { ViewAll: id } })
                res.status(200).json("View successfully");
            } else {
                res.status(404).json("Already view");
            }

        } catch (error) {
            console.log({ message: error.message });
        }
    }


}