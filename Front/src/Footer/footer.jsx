import React from "react";
import styles from "./footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.box}>
          <p className={styles.title}>
            Comment voyager aver <br /> Covoitun
          </p>
          <ul className={styles.textList}>
            <li>Trajets populaires en covoiturage</li>
            <li>Destinations populaires en covoiturage</li>
            <li>Voyager avec nous</li>
          </ul>
        </div>

        <div className={styles.box}>
          <p className={styles.title}>En savoir plus</p>
          <ul className={styles.links}>
            <li>
              <a href="#">Qui sommes-nous?</a>
            </li>
            <li>
              <a href="#">Centre d’aide</a>
            </li>
            <li>
              <a href="#">Comment ça marche</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.socials}>
        <button>Langue - Français</button>

        <ul className={styles.social}>
          <li>
            <a href="#" className={styles.facebook}>
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.twitter}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.youtube}>
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
        </ul>
      </div>
      <p className={styles.copyright}>
        &copy; 2025 <span>Covoitun</span> Tous droits réservés
      </p>
    </div>
  );
}

export default Footer;
