import React, { useState } from "react";
import "./Register.css";

function RegisterPage() {
  const [profilePic, setProfilePic] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(""); // State to store ID photo name

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", e.target.firstName.value);
    formData.append("lastName", e.target.lastName.value);
    formData.append("idNumber", e.target.idNumber.value);
    formData.append("email", e.target.email.value);
    formData.append("age", e.target.age.value);
    formData.append("password", e.target.password.value);
    formData.append("profilePic", profilePic);
    formData.append("idPhoto", idPhoto);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/Verification";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleIdPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIdPhoto(file);
      setIdPhotoName(file.name); // Store the file name
    }
  };

  const handleDeletePhoto = () => {
    setProfilePic(null);
  };

  return (
    <div className="Register_container">
      <div className="Register_card">
        <h2 className="Register_title">Inscrivez-vous</h2>
        <div className="contentWrapper">
          <div className="profileSection">
            <div className="profilePic">
              {profilePic ? (
                <img src={URL.createObjectURL(profilePic)} alt="Profile" className="img" />
              ) : (
                <div className="placeholder">+</div>
              )}
            </div>
            <div className="photoActions">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="uploadBtn">Télécharger une photo</label>
              <button className="deleteBtn" onClick={handleDeletePhoto}>Supprimer la photo</button>
            </div>
          </div>
          <form className="Register_form" onSubmit={handleSubmit}>
            <input type="text" name="lastName" placeholder="Nom de famille" className="input" required />
            <input type="text" name="firstName" placeholder="Prénom" className="input" required />
            <input type="text" name="idNumber" placeholder="Numéro carte d’identité" className="input" required />
            <input type="email" name="email" placeholder="E-mail" className="input" required />
            <input type="number" name="age" placeholder="Age" className="input" required />
            <input type="password" name="password" placeholder="Mot de passe" className="input" required />
            <input type="password" name="confirmPassword" placeholder="Confirmer mot de passe" className="input" required />
            
            <div className="idPhotoSection">
              <label>Une photo de votre pièce d'identité incluant suffisamment votre nom, âge et photo</label>
              <input type="file" accept="image/*" onChange={handleIdPhotoUpload} className="hidden" id="id-upload" />
              <label htmlFor="id-upload" className="uploadBtn">Ajouter une photo</label>
              {idPhotoName && <span className="file-name">{idPhotoName}</span>} {/* Show uploaded file name */}
            </div>

            <button type="submit" className="btn">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
