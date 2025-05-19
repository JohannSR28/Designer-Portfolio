// Title.jsx corrigé
"use client";
import React, { useState, useEffect } from "react";
import styles from "./Title.module.css";
import SocialLinks from "../SocialLinks/SocialLinks";

function Title() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton quand on défile au-delà de 200px
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    // Initialiser l'écouteur d'événement
    window.addEventListener("scroll", handleScroll);

    // Vérifier l'état initial
    handleScroll();

    // Nettoyage à la désinscription du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className={styles.viewBox}>
          <h1 className={styles.title}>
            <span className={styles.letterNormal}>P</span>
            <span className={styles.letterDown}>O</span>
            <span className={styles.letterNormal}>R</span>
            <span className={styles.letterNormal}>T</span>
            <span className={styles.letterNormal}>F</span>
            <span className={styles.letterNormal}>O</span>
            <span className={styles.letterNormal}>L</span>
            <span className={styles.letterNormal}>I</span>
            <span className={styles.letterUp}>O</span>
          </h1>
        </div>
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitle}>PAUL EMMANUEL DATO</p>
          <SocialLinks />
        </div>
      </div>

      {/* Bouton pour remonter avec style corrigé */}
      {showScrollTop && (
        <button
          className={styles.scrollTopButton}
          onClick={scrollToTop}
          aria-label="Remonter en haut de la page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Title;
