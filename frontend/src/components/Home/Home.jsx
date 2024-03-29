import React from "react";
import Styles from "../../styles/Home.module.css";
import { decodeToken } from "react-jwt";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import Loading from "../../lottie/loading.json";
import AddGroup from "../AddGroup/AddGroup";
import { fetchUsers, fetchSenders, fetchRecievers } from "../../api/api_calls";

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
  const [typing, setTyping] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const openAddGroupPopup = () => {
    setIsAddGroupPopupOpen(true);
  };

  const closeAddGroupPopup = () => {
    setIsAddGroupPopupOpen(false);
  };

  const handleInputChange = async (e) => {
    setMessage(e.target.value);
  };

  const handleTyping = async () => {
    console.log("typing");
    socket.emit("typing", {
      senderId: senderId,
      activeChatId: activeChatId,
      typing: true,
    });

    setTimeout(() => {
      socket.emit(
        "typing",
        {
          senderId: senderId,
          activeChatId: activeChatId,
          typing: false,
        },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
      console.log("not typing");
    }, 1300);
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

    try {
      const responseSenders = await fetchRecievers(senderId, activeChatId);

      const responseReceivers = await fetchRecievers(activeChatId, senderId);

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
    const users = async () => {
      try {
        setLoading(true);
        const json = await fetchUsers();
        setUsers(json);
        setLoading(false);
        const options = json.map((user) => ({
          label: user.username,
          value: user._id.toString(),
        }));
        setOptions(options);
      } catch (error) {
        console.log(error);
      }
    };
    users();
  }, [token]);

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

  React.useEffect(() => {
    socket.on("typing", (user) => {
      if (user.senderId === senderId) {
        setTyping(user.typing);
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

  const [selected, setSelected] = React.useState([]);

  return (
    <div className={Styles.main}>
      {loading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <Lottie animationData={Loading} loop={true} />
        </div>
      ) : (
        <>
          {isAddGroupPopupOpen && (
            <AddGroup
              options={options}
              selected={selected}
              setSelected={setSelected}
              closeAddGroupPopup={closeAddGroupPopup}
            />
          )}

          <div className={Styles.left}>
            <div className={Styles.profile}>
              <span>Chats</span>
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
                      activeChatId === user._id ? Styles.activeChat : ""
                    }`}
                    key={index}
                    onClick={() => {
                      setActiveChatUser(user.username);
                      setActiveChatId(user._id);
                    }}
                  >
                    <div className={Styles.chatImg}>
                      <img
                        src="/images/profile.png"
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>{activeChatUser}</div>
                  {typing == true && activeChatUser && (
                    <div className={Styles.typing}>typing...</div>
                  )}
                </div>
              </div>
              <div className={Styles.chatArea}>
                {activeChatUser ? (
                  <div className={Styles.messageContainer}>
                    <div className={Styles.messagesWrapper}>
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
                          <div className={Styles.timestampDiv}>
                            <span className={Styles.timestamp}>
                              {new Date(msg.timestamp)
                                .toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                .toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                      handleTyping();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
