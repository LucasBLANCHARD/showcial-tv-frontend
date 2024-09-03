export const generateSlug = (textToSlug) => {
  return textToSlug
    .toLowerCase()
    .normalize('NFD') // Sépare les caractères accentués de leur base
    .replace(/[\u0300-\u036f]/g, '') // Supprime les marques d'accentuation
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/[^\w-]+/g, ''); // Supprime les caractères non alphanumériques sauf les tirets
};
