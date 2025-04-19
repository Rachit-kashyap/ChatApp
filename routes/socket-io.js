const User = require("../models/user-model");

const singleChat = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("conn", async (sender) => {
            let user = await User.findOne({ phoneNumber: sender });
            if (user) {
                user.socketId = socket.id;
                await user.save();
                console.log(`User ${sender} connected with socket ID ${socket.id}`);
            }
        });

        socket.on("message", async ({ message, receiver, sender }) => {
            let receiverUser = await User.findOne({ phoneNumber: receiver });
            let senderUser = await User.findOne({ phoneNumber: sender });

            console.log("Message received:", message);

            if (receiverUser && receiverUser.socketId) {
                console.log("Sending message to", receiver);
                io.to(receiverUser.socketId).emit("message", {
                    message,
                    name: senderUser ? senderUser.name : "Unknown"
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = singleChat;
