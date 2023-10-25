const API_URL = import.meta.env.VITE_API_URL;

const USER_API = `${API_URL}/api/users`;

export async function fetchUsers() {
  try {
    console.log("USER_URL", USER_API);
    const response = await fetch(USER_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log("json", json);
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSenders(activeChatId, senderId) {
  try {
    const responseSenders = await fetch(
      `${API_URL}/api/message/${activeChatId}/${senderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return responseSenders;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchRecievers(senderId, activeChatId) {
  try {
    const responseReceivers = await fetch(
      `${API_URL}/api/message/${senderId}/${activeChatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return responseReceivers;
  } catch (error) {
    console.log(error);
  }
}
