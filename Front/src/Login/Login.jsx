import { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./Login.module.css";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      window.location.href = "/"; // Redirect to home on success
    } catch (error) {
      alert(
        "Login failed : " + error.response?.data?.message || "Server error"
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Connecter-vous</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggleIcon}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            )}
          </div>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Se souvenir de moi
          </div>
          <div className={styles.forgotPassword}>Mot de passe oublié ?</div>
          <p className={styles.signupPrompt}>
            Pas encore un membre? <a href="/Register">Inscrivez-vous</a>
          </p>
          <button type="submit" className={styles.loginButton}>
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
