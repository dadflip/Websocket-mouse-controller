'use client';

import { useState, useEffect } from 'react';
import DesktopInterface from '../desktop/page';
import MobileInterface from '../mobile/page';

export default function SyntheticV0PageForDeployment() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fonction pour détecter si l'appareil est mobile
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Appeler la détection au chargement de la page
    detectDevice();

    // Ajouter un gestionnaire d'événements pour détecter les changements de taille de fenêtre
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Exemple de seuil
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? <MobileInterface /> : <DesktopInterface />;
}
