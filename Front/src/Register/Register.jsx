import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./Register.module.css";

import {
  FaUserCircle,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function RegisterPage() {
  const [profilePic, setProfilePic] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState(""); // State to store ID photo name
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleIconClick = (platform) => {
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlatform("");
  };

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
    <div className={styles.registerContainer}>
      <div className={styles.signupContainer}>
        <div className={styles.profileSection}>
          <label className={styles.pdp}>Photo de profil</label>
          <div className={styles.profilePic}>
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile"
                className={styles.img}
              />
            ) : (
              <FaUserCircle className={styles.icon} />
            )}
          </div>
          <div className={styles.photoActions}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hidden}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.uploadBtn}>
              Télécharger une photo
            </label>
            <button className={styles.deleteBtn} onClick={handleDeletePhoto}>
              Supprimer la photo
            </button>
          </div>
        </div>
        <div className={styles.registerCard}>
          <h2 className={styles.registerTitle}>Inscrivez-vous</h2>
          <div className={styles.contentWrapper}>
            <form className={styles.registerForm} onSubmit={handleSubmit}>
              <input
                type="text"
                name="lastName"
                placeholder="Nom de famille"
                className={styles.input}
                required
              />
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                className={styles.input}
                required
              />
              <input
                type="text"
                name="idNumber"
                placeholder="Numéro carte d’identité"
                className={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className={styles.input}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className={styles.input}
                required
              />
              <div className={styles.password}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className={styles.input}
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
              <div className={styles.password}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer mot de passe"
                  className={styles.input}
                  required
                />
                {confirmPassword.length > 0 && (
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.passwordToggleIcon}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                )}
              </div>
              <div className={styles.idPhotoSection}>
                <label>
                  Une photo de votre pièce d'identité incluant suffisamment
                  votre nom, âge et photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdPhotoUpload}
                  className={styles.hidden}
                  id="id-upload"
                />
                <label htmlFor="id-upload" className={styles.uploadBtn}>
                  Ajouter une photo
                </label>
                {idPhotoName && (
                  <span className={styles.fileName}>{idPhotoName}</span>
                )}
              </div>
              <div className={styles.contactContainer}>
                <label className={styles.contactLabel}>
                  Ajouter un moyen de contact
                </label>

                <div className={styles.iconContainer}>
                  <div
                    className={styles.iconWrapper}
                    onClick={() => handleIconClick("Facebook")}
                  >
                    <FaFacebook className={styles.socialicon} />
                  </div>
                  <div
                    className={styles.iconWrapper}
                    onClick={() => handleIconClick("Instagram")}
                  >
                    <FaInstagram className={styles.socialicon} />
                  </div>
                  <div
                    className={styles.iconWrapper}
                    onClick={() => handleIconClick("WhatsApp")}
                  >
                    <FaWhatsapp className={styles.socialicon} />
                  </div>
                </div>

                {showModal && (
                  <div className={styles.modal}>
                    <div className={styles.modalContent}>
                      <span
                        className={styles.closeButton}
                        onClick={handleCloseModal}
                      >
                        &times;
                      </span>
                      <h3>Connectez votre {selectedPlatform} account</h3>
                      <p>
                        Pour continuer, connectez-vous à votre compte{" "}
                        {selectedPlatform}.
                      </p>
                      <button
                        className={styles.button}
                        style={{ margin: "10px", fontSize: "16px" }}
                        onClick={handleCloseModal}
                      >
                        Connecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className={styles.button}>
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}