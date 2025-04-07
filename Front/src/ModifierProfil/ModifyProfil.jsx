import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  FaUserCircle,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "./ModifyProfil.module.css";

export default function ModifyProfil() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    age: "",
    password: "",
    oldPassword: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [idPhotoName, setIdPhotoName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userId, setUserId] = useState(null); // to use for PUT later

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const id = decodedToken.id;
        setUserId(id);

        const response = await axios.get(`http://localhost:5000/user/${id}`);
        const user = response.data;

        setUserData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          idNumber: user.idNumber || "",
          email: user.email || "",
          age: user.age || "",
          password: "",
          oldPassword: "",
        });

        setProfilePic(user.profilePic || null);
        setIdPhoto(user.idPhoto || null);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
      setIdPhotoName(file.name);
    }
  };

  const handleDeletePhoto = () => {
    setProfilePic(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (profilePic) formData.append("profilePic", profilePic);
    if (idPhoto) formData.append("idPhoto", idPhoto);

    try {
      const response = await axios.put(`http://localhost:5000/user/${userId}`, formData);
    
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      if (error.response && error.response.data.error === "Incorrect old password") {
        alert("Ancien mot de passe incorrect !");
      } else {
        alert("Une erreur s'est produite.");
      }
    }
    
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.signupContainer}>
        <div className={styles.profileSection}>
          <label className={styles.pdp}>Photo de profil</label>
          <div className={styles.profilePic}>
            {profilePic ? (
              <img
                src={`data:image/jpeg;base64, ${profilePic}`}
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
          <h2 className={styles.registerTitle}>Modifier le profil</h2>
          <div className={styles.contentWrapper}>
            <form className={styles.registerForm} onSubmit={handleSubmit}>
              <input
                type="text"
                name="lastName"
                placeholder="Nom de famille"
                className={styles.input}
                value={userData.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                className={styles.input}
                value={userData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="idNumber"
                placeholder="Numéro carte d’identité"
                className={styles.input}
                value={userData.idNumber}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className={styles.input}
                value={userData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className={styles.input}
                value={userData.age}
                onChange={handleInputChange}
                required
              />

              <div className={styles.password}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nouveau mot de passe"
                  className={styles.input}
                  value={userData.password}
                  onChange={handleInputChange}
                />
                {userData.password.length > 0 && (
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
                  name="oldPassword"
                  placeholder="Ancien mot de passe"
                  className={styles.input}
                  value={userData.oldPassword}
                  onChange={handleInputChange}
                />
                {userData.oldPassword.length > 0 && (
                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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

              <button type="submit" className={styles.button}>
                Modifier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
