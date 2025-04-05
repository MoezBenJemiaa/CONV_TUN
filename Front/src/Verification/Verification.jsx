import React, { useRef } from 'react';
import './Verification.css';

const ConfirmationCode = () => {
  const inputs = useRef([]);

  const handleInputChange = (e, index) => {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');

    // If a digit is entered, move focus to the next input
    if (e.target.value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // If Backspace is pressed and the input is empty, move focus to the previous input
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleValidation = () => {
    // Collect the code from the input fields
    const code = inputs.current.map(input => input.value).join('');
    console.log('Code entered:', code);
    if (code==="1234") {
        window.location.href = "/";
      } else {
        alert("Code incorrect");
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
        <a href="#" className="resendLink">envoyer de nouveau un code</a>
      </div>
      <button className="validateButton" onClick={handleValidation}>
        Valider
      </button>
    </div>
  );
};

export default ConfirmationCode;