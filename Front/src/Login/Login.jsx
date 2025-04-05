import { useState } from "react";
import axios from "axios";
import "./Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    alert("Login failed : "+ error.response?.data?.message || "Server error");
  }
  };

  
  return (
    <div className="login_container">
      <div className="login-box">
        <h2 className="title">Connecter-vous</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label>Se souvenir de moi</label>
          </div>
          <div className="forgot-password">Mot de passe oublié ?</div>
          <p class="signup-prompt">Pas encore un membre? <a href="/Register">Inscrivez-vous</a></p>
          <button type="submit" className="login-button">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
