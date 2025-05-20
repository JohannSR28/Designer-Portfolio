"use client";
import React, { useRef, useEffect, useState } from "react";
import blocsData from "@/asset/BlocData";
import styles from "./SummaryBloc.module.css";

// Types pour les blocs
type ComplexBloc = {
  type: "complex";
  id: string;
  number: number;
  title: string;
  name: string;
  li: string[];
  dimensions?: {
    width: string;
    height?: string;
  };
};

type SimpleBloc = {
  type: "simple";
  id: string;
  title: string;
  dimensions?: {
    width: string;
    height?: string;
  };
  textStyle?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
  };
};

type Bloc = ComplexBloc | SimpleBloc;

// Composant pour le bloc complexe
const ComplexBlock: React.FC<
  ComplexBloc & {
    onRef: (element: HTMLDivElement) => void;
    isResponsiveMode: boolean;
  }
> = ({ id, title, name, li, onRef, isResponsiveMode, dimensions }) => {
  // Fonction de défilement vers les IDs de display (format Bloc1d, Bloc2d, etc.)
  const handleClick = () => {
    // Extraire le numéro du bloc actuel et créer l'ID cible
    const blocNumber = id.replace("Bloc", "");
    const targetId = `Bloc${blocNumber}d`; // Ajouter "d" à la fin

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Défilement simple
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn(`Élément cible ${targetId} non trouvé`);
    }
  };

  const style = {
    width: isResponsiveMode ? "100%" : dimensions?.width || "300px",
    height: dimensions?.height || "auto",
    cursor: "pointer", // Indique que le bloc est cliquable
  };

  return (
    <div
      id={id}
      ref={onRef}
      className={`${styles.complexBlock} ${
        isResponsiveMode ? styles.complexBlockResponsive : ""
      }`}
      style={style}
      onClick={handleClick}
    >
      <div>
        <span className={styles.complexBlockTitle}>{title}</span>
        <span className={styles.complexBlockName}>{name}</span>
      </div>
      <ul className={styles.linksList}>
        {li.map((item, index) => (
          <li key={index} className={styles.linkItem}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant pour le bloc simple
const SimpleBlock: React.FC<
  SimpleBloc & {
    onRef: (element: HTMLDivElement) => void;
    isResponsiveMode: boolean;
  }
> = ({ id, title, onRef, isResponsiveMode, dimensions, textStyle }) => {
  // Si on est en mode responsive, on ne rend rien
  if (isResponsiveMode) {
    return null;
  }

  const style = {
    width: dimensions?.width || "200px",
    height: dimensions?.height || "auto",
    fontSize: textStyle?.fontSize || undefined,
    fontWeight: textStyle?.fontWeight || "bold",
    fontFamily: textStyle?.fontFamily || "inherit",
    lineHeight: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div id={id} ref={onRef} className={styles.simpleBlock} style={style}>
      <span>{title}</span>
    </div>
  );
};

// Composant pour un bloc positionné (wrapper)
const PositionedBloc: React.FC<{
  bloc: Bloc;
  position: {
    x: number;
    y: number;
  };
  isResponsiveMode: boolean;
  responsiveIndex: number;
  onHeightChange: (id: string, height: number, y: number) => void;
}> = ({
  bloc,
  position,
  isResponsiveMode,
  responsiveIndex,
  onHeightChange,
}) => {
  // Si c'est un bloc simple et qu'on est en mode responsive, ne pas rendre
  if (bloc.type === "simple" && isResponsiveMode) {
    return null;
  }

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      const height = elementRef.current.offsetHeight;
      onHeightChange(
        bloc.id,
        height,
        isResponsiveMode ? responsiveIndex * (height + 20) : position.y
      );
    }
  }, [bloc.id, onHeightChange, position.y, isResponsiveMode, responsiveIndex]);

  const handleRef = (element: HTMLDivElement) => {
    elementRef.current = element;
    if (element) {
      const height = element.offsetHeight;
      onHeightChange(
        bloc.id,
        height,
        isResponsiveMode ? responsiveIndex * (height + 20) : position.y
      );
    }
  };

  const positionClass = isResponsiveMode
    ? styles.positionedBlockRelative
    : styles.positionedBlockAbsolute;

  const positionStyle = isResponsiveMode
    ? {}
    : {
        left: `${position.x}px`,
        top: `${position.y}px`,
      };

  return (
    <div className={positionClass} style={positionStyle}>
      {bloc.type === "complex" ? (
        <ComplexBlock
          {...bloc}
          onRef={handleRef}
          isResponsiveMode={isResponsiveMode}
        />
      ) : (
        <SimpleBlock
          {...bloc}
          onRef={handleRef}
          isResponsiveMode={isResponsiveMode}
        />
      )}
    </div>
  );
};

// Composant principal du conteneur
const BlockContainer: React.FC<{
  positionedBlocs: Array<{
    bloc: Bloc;
    position: {
      x: number;
      y: number;
    };
  }>;
}> = ({ positionedBlocs }) => {
  const [containerHeight, setContainerHeight] = useState(800);
  const [isResponsiveMode, setIsResponsiveMode] = useState(false);
  const blocHeightsMap = useRef<
    Map<string, { height: number; bottom: number }>
  >(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeightChange = (id: string, height: number, y: number) => {
    blocHeightsMap.current.set(id, { height, bottom: y + height });

    // Calculer la nouvelle hauteur du conteneur
    let maxBottom = 0;
    blocHeightsMap.current.forEach((data) => {
      if (data.bottom > maxBottom) {
        maxBottom = data.bottom;
      }
    });

    // Ajouter un peu d'espace en bas
    setContainerHeight(maxBottom + 25);
  };

  useEffect(() => {
    const checkWindowSize = () => {
      setIsResponsiveMode(window.innerWidth < 768);
    };

    // Vérifier la taille initiale
    checkWindowSize();

    // Ajouter un écouteur pour les changements de taille
    window.addEventListener("resize", checkWindowSize);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  // Filtrer les blocs simples en mode responsive
  const filteredBlocs = isResponsiveMode
    ? positionedBlocs.filter((item) => item.bloc.type !== "simple")
    : positionedBlocs;

  return (
    <div
      ref={containerRef}
      className={`${styles.blockContainer} ${
        isResponsiveMode ? styles.responsiveContainer : ""
      }`}
      style={{
        height: isResponsiveMode ? "auto" : `${containerHeight}px`,
      }}
    >
      {filteredBlocs.map((item, index) => (
        <PositionedBloc
          key={item.bloc.id || `bloc-${index}`}
          bloc={item.bloc}
          position={item.position}
          isResponsiveMode={isResponsiveMode}
          responsiveIndex={index}
          onHeightChange={handleHeightChange}
        />
      ))}
    </div>
  );
};

// Composant principal
const SummaryBloc = () => {
  // Assurez-vous que les ID des blocs complexes sont correctement définis
  const complexBlocs = blocsData.map((item, index) => ({
    type: "complex" as const,
    ...item,
    id: `Bloc${index + 1}`, // Format Bloc1, Bloc2, etc.
  }));

  // Exemple de blocs simples
  const simpleBlocs: SimpleBloc[] = [
    {
      type: "simple",
      id: "simple1",
      title: "TABLE DES MATIÈRES",
      textStyle: {
        fontSize: "80px",
        fontWeight: "900",
      },
    },
  ];

  // Définition manuelle des positions (inchangée)
  const positionedBlocs = [
    // Blocs complexes positionnés manuellement avec dimensions personnalisées
    {
      bloc: {
        ...complexBlocs[0],
        dimensions: { width: "310px", height: "auto" },
      },
      position: { x: 50, y: 50 },
    },
    {
      bloc: {
        ...complexBlocs[1],
        dimensions: { width: "350px", height: "auto" },
      },
      position: { x: 425, y: 50 },
    },
    {
      bloc: {
        ...complexBlocs[2],
        dimensions: { width: "350px", height: "auto" },
      },
      position: { x: 850, y: 50 },
    },
    {
      bloc: {
        ...complexBlocs[3],
        dimensions: { width: "350px", height: "250px" },
      },
      position: { x: 850, y: 250 },
    },
    {
      bloc: {
        ...complexBlocs[4],
        dimensions: { width: "auto", height: "auto" },
      },
      position: { x: 800, y: 600 },
    },
    {
      bloc: {
        ...complexBlocs[5],
        dimensions: { width: "200px", height: "auto" },
      },
      position: { x: 1000, y: 600 },
    },

    // Blocs simples positionnés manuellement
    {
      bloc: {
        ...simpleBlocs[0],
        dimensions: { width: "700px", height: "300px" },
      },
      position: { x: 50, y: 600 },
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Catalogue des projets</h2>
      <BlockContainer positionedBlocs={positionedBlocs} />
    </div>
  );
};

export default SummaryBloc;
