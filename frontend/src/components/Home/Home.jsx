import React from "react";
import Styles from "../../styles/Home.module.css";
import { decodeToken } from "react-jwt";
import { MultiSelect } from "react-multi-select-component";
import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;

function Home() {
  const socket = io.connect(socketUrl);

  const token = localStorage.getItem("token");
  const [author, setAuthor] = React.useState("ChatUser");
  const [users, setUsers] = React.useState([1, 2, 3, 4, 5]);
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [activeChatUser, setActiveChatUser] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [senderId, setSenderId] = React.useState("");
  const [isAddGroupPopupOpen, setIsAddGroupPopupOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const openAddGroupPopup = () => {
    setIsAddGroupPopupOpen(true);
  };

  const closeAddGroupPopup = () => {
    setIsAddGroupPopupOpen(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatUser) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: activeChatId, // Replace with your actual chat ID
          senderId: senderId, // Replace with the sender's ID
          text: message,
        }),
      });

      if (response.ok) {
        const newMessage = {
          id: senderId, // Assuming the sender is you
          content: message,
          timestamp: new Date().toJSON(), // Use the current timestamp
        };

        socket.emit("chat", {
          senderId: senderId,
          activeChatId: activeChatId,
          message: message,
        });

        // Update the messages state with the new message
        setMessages([...messages, newMessage]);
        setMessage(""); // Clear the input field
      } else {
        console.error("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    if (!activeChatId) {
      return;
    }

    console.log("IDs", activeChatId, senderId);

    try {
      const responseSenders = await fetch(
        `${apiUrl}/api/message/${activeChatId}/${senderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseReceivers = await fetch(
        `${apiUrl}/api/message/${senderId}/${activeChatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responseSenders.ok && responseReceivers.ok) {
        const senderMessages = await responseSenders.json();
        const receiverMessages = await responseReceivers.json();

        let senderList = [];
        let receiverList = [];

        if (senderMessages.result) {
          senderList = senderMessages.result.text;
        }

        if (receiverMessages.result) {
          receiverList = receiverMessages.result.text;
        }

        console.log("senderList", senderList);
        console.log("receiverList", receiverList);

        // Merge sender and receiver messages
        const allMessages = [
          ...senderList.map((message) => ({
            id: senderId,
            content: message.content,
            timestamp: message.timestamp,
          })),
          ...receiverList.map((message) => ({
            id: activeChatId,
            content: message.content,
            timestamp: message.timestamp,
          })),
        ];

        // Sort messages by timestamp
        allMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        console.log("allMessages", allMessages);
        // Set the sorted messages in your state variable (e.g., setMessages)
        setMessages(allMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    socket.on("chat", (user) => {
      if (user.senderId === senderId) {
        const newMessage = {
          id: user.activeChatId, // Assuming the sender is you
          content: user.message,
          timestamp: new Date().toJSON(), // Use the current timestamp
        };
        setMessages([...messages, newMessage]);
      }
    });
  });

  // Fetch messages when the active chat changes
  React.useEffect(() => {
    fetchMessages();
  }, [activeChatId]);

  React.useEffect(() => {
    if (!token) {
      window.location = "/login";
    } else {
      const decodedToken = decodeToken(token);
      setSenderId(decodedToken.id);
      console.log("senderId", decodedToken.id);
      setAuthor(decodedToken.username);
    }
  }, [token]);

  React.useEffect(() => {
    const users = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log(json);
        setUsers(json);
        const options = json.map((user) => ({
          label: user.username,
          value: user._id.toString(),
        }));
        console.log("options", options);
        setOptions(options);
      } catch (error) {
        console.log(error);
      }
    };
    users();
  }, [token]);

  const [selected, setSelected] = React.useState([]);

  return (
    <div className={Styles.main}>
      {isAddGroupPopupOpen && (
        <div className={Styles.addPopup}>
          <h3>Create a New Group</h3>
          <input type="text" placeholder="Group Name" />
          <input type="text" placeholder="Group Description" />
          <h3>Select Group Members</h3>
          <pre>{JSON.stringify(selected.label)}</pre>
          <MultiSelect
            className={Styles.selectGroup}
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy="Select"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "15rem",
            }}
          >
            <button style={{ color: "black" }}>Create</button>
            <button
              style={{ backgroundColor: "red" }}
              onClick={closeAddGroupPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={Styles.left}>
        <div className={Styles.profile}>
          <img
            src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
            alt="user"
          />
          <h3>{author}</h3>
          <button className={Styles.addGroup} onClick={openAddGroupPopup}>
            <h3>+</h3>
          </button>
        </div>
        <div className={Styles.chats}>
          {users
            .filter((user) => user.username !== author)
            .map((user, index) => (
              <div
                className={`${Styles.chat} ${
                  author === user.username ? Styles.activeChat : ""
                }`}
                key={index}
                onClick={() => {
                  setActiveChatUser(user.username);
                  setActiveChatId(user._id);
                }}
              >
                <div className={Styles.chatImg}>
                  <img
                    src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                    alt="user"
                  />
                </div>
                <div className={Styles.chatInfo}>
                  <h3>{user.username}</h3>
                  <p>Message</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={Styles.right}>
        <div className={Styles.mainChat}>
          <div className={Styles.chatHeader}>
            <img
              src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
              alt="user"
            />
            <div>{activeChatUser}</div>
          </div>
          <div className={Styles.chatArea}>
            {activeChatUser ? (
              <div className={Styles.messageContainer}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${Styles.message} ${
                      msg.id === senderId
                        ? Styles.rightMessage
                        : Styles.leftMessage
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={Styles.timestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={Styles.placeholder}>
                Select a chat to start messaging
              </div>
            )}
          </div>
          <div className={Styles.top}>
            <div className={Styles.sendText}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className={Styles.send} onClick={handleSendMessage}>
              <button>
                <img
                  src="https://www.pngitem.com/pimgs/m/11-118680_icon-png-send-icon-white-transparent-png.png"
                  alt="menu"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
