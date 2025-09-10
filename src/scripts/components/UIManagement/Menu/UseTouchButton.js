import { useCallback } from 'react';

export const useTouchButton = () => {
  const handleTouchStart = useCallback((event) => {
    event.preventDefault();
    const button = event.currentTarget;
    
    // Animation immédiate au début du touch
    if (!button.disabled) {
      button.classList.add('touch-pressed');
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const touch = event.touches[0];
    
    if (!touch) return;
    
    // Vérifier si le doigt est encore sur le bouton
    const rect = button.getBoundingClientRect();
    const isInsideButton = (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    );
    
    // Mettre à jour la classe selon la position
    if (isInsideButton) {
      button.classList.add('touch-pressed');
    } else {
      button.classList.remove('touch-pressed');
    }
  }, []);

  const handleTouchEnd = useCallback((event, onClick) => {
    event.preventDefault();
    const button = event.currentTarget;
    const touch = event.changedTouches[0];
    
    // Enlever l'animation
    button.classList.remove('touch-pressed');
    
    // Vérifier si le relâchement se fait sur le bouton
    if (touch && onClick && !button.disabled) {
      const rect = button.getBoundingClientRect();
      const isInsideButton = (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      );
      
      // Exécuter la fonction seulement si on relâche sur le bouton
      if (isInsideButton) {
        onClick();
      }
    }
  }, []);

  const handleTouchCancel = useCallback((event) => {
    event.preventDefault();
    const button = event.currentTarget;
    
    // Juste enlever l'animation, pas d'exécution de fonction
    button.classList.remove('touch-pressed');
  }, []);

  const getTouchProps = useCallback((onClick) => ({
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: (e) => handleTouchEnd(e, onClick),
    onTouchCancel: handleTouchCancel,
  }), [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  // Version spéciale pour les boutons avec répétition (bet buttons)
  const getTouchPropsForRepeating = useCallback((onStart, onEnd) => ({
    onTouchStart: (e) => {
      handleTouchStart(e);
      if (onStart && !e.currentTarget.disabled) {
        onStart(e);
      }
    },
    onTouchMove: (e) => {
      handleTouchMove(e);
      
      // Pour les boutons de répétition, arrêter la répétition si on sort du bouton
      const button = e.currentTarget;
      const touch = e.touches[0];
      
      if (!touch) return;
      
      const rect = button.getBoundingClientRect();
      const isInsideButton = (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      );
      
      if (!isInsideButton && onEnd && !button.disabled) {
        onEnd(e);
      }
    },
    onTouchEnd: (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove('touch-pressed');
      if (onEnd && !e.currentTarget.disabled) {
        onEnd(e);
      }
    },
    onTouchCancel: (e) => {
      handleTouchCancel(e);
      if (onEnd && !e.currentTarget.disabled) {
        onEnd(e);
      }
    },
  }), [handleTouchStart, handleTouchMove, handleTouchCancel]);

  return { getTouchProps, getTouchPropsForRepeating };
};