import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // firstname: {
    //     type: String,
    //     required: true,
    // },
    // lastname: {
    //     type: String,
    //     required: true,
    // },
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    // },
    // about: String,
}, {
    timestamps: true,
});

const UserModal = mongoose.model("Users", userSchema);

export default UserModal;