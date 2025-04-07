import React, { useRef, useEffect, useState } from 'react';
import './Verification.css';
import axios from 'axios';

const ConfirmationCode = () => {
  const inputs = useRef([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setEmail(decoded.email);

      // Send verification code when the component loads
      axios.post("http://localhost:5000/user/send-code", { email })
        .then(() => console.log("Code envoyé à l'email:", email))
        .catch(err => console.error("Erreur envoi code:", err));
    }
  }, []);

  const handleInputChange = (e, index) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    if (e.target.value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleValidation = async () => {
    const code = inputs.current.map(input => input.value).join('');
    try {
      const response = await axios.post("http://localhost:5000/user/verify-code", {
        email,
        code
      });

      if (response.data.success) {
        alert("Vérification réussie !");
        window.location.href = "/";
      } else {
        alert("Code incorrect");
      }
    } catch (error) {
      alert("Erreur lors de la vérification");
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/user/send-code", { email });
      alert("Code renvoyé !");
    } catch (err) {
      alert("Erreur lors de la réexpédition du code");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Entrer le code de confirmation</h1>
      <p className="description">
        Nous avons transmis deux codes de validation, l'un à votre email et l'autre à votre numéro de téléphone.
      </p>
      <div className="codeSection">
        <h2 className="sectionTitle">Entrer le code envoyé à votre email ici:</h2>
        <div className="codeInputs">
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="codeInput"
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputs.current[index] = el)}
            />
          ))}
        </div>
        <a href="#" className="resendLink" onClick={handleResendCode}>
          envoyer de nouveau un code
        </a>
      </div>
      <button className="validateButton" onClick={handleValidation}>
        Valider
      </button>
    </div>
  );
};

export default ConfirmationCode;
