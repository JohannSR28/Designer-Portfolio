// Exemple de composant BlocDisplayOne avec ID au format "Bloc1d"
import React from "react";
import styles from "./BlocDisplayOne.module.css"; // Créez ce fichier CSS si nécessaire

function BlocDisplayOne() {
  // L'ID est au format "Bloc1d", "Bloc2d", etc.
  const id = `Bloc1d`;

  return (
    <div id={id} className={styles.blocDisplayOne}>
      <p>This is Bloc Display One.</p>
    </div>
  );
}

export default BlocDisplayOne;
