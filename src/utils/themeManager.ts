export const getTheme = () => {
  return localStorage.getItem('theme') || 'dark'; // Retourne 'dark' si aucun thème n'est stocké
};

// Fonction pour initialiser le thème lors du chargement de l'application
export const initTheme = () => {
  const savedTheme = getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
};
