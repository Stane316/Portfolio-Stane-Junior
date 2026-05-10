// src/lib/translator.ts

/**
 * Traduit un texte du Français vers l'Anglais
 * Utilise l'API MyMemory (Gratuite)
 */
export const translateToEnglish = async (text: string): Promise<string> => {
  if (!text) return '';
  
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|en`
    );
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      console.warn('Erreur traduction:', data);
      return text; // Retourne le texte original en cas d'erreur
    }
  } catch (error) {
    console.error('Erreur réseau traduction:', error);
    return text;
  }
};