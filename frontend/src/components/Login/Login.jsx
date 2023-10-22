import { useState } from "react";
import Styles from "../../styles/Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import Lottie from "lottie-react";
import Loading from "../../lottie/loading.json";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
      // const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", json.token);
        console.log(json.token);
        setLoading(false);

        window.location = "/";
      } else {
        toast.error(json.error);
        setLoading(false);
      }
      // console.log("Success:", JSON.stringify(json));
    } catch (error) {
      console.error("Error:", error);
      if (error) {
        toast.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className={Styles.login_container}>
      <ToastContainer />
      {loading ? (
        <Lottie animationData={Loading} loop={true} />
      ) : (
        <div className={Styles.ccontainer}>
          <div className={Styles.left}>LOGIN</div>
          <div className={Styles.right}>
            <div className={Styles.form_container}>
              <img src="images/authBg.jpg" alt="login" />
              <form onSubmit={handleLogin}>
                <div className={Styles.container}>
                  <input
                    type="text"
                    name="text"
                    className={Styles.input}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className={Styles.container}>
                  <input
                    type="password"
                    name="text"
                    className={Styles.input}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className={Styles.loginbtn} type="submit">
                  Login
                </button>
              </form>
              <p>
                Dont have an account? <a href="/signup">Register here</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
