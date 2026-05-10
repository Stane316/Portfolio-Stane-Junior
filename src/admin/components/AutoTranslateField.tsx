import React, { useState } from 'react';
import { translateToEnglish } from '../../lib/translator';

interface AutoTranslateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  rows?: number;
}

const AutoTranslateField: React.FC<AutoTranslateFieldProps> = ({ 
  label, value, onChange, placeholder, type = 'textarea', rows = 3 
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!value) return;
    setIsTranslating(true);
    
    // On appelle l'API pour traduire le texte actuel
    // Note: Ici on suppose que le texte entré est en FR et on veut générer l'EN.
    // Dans l'admin, ce composant sera utilisé pour le champ EN, 
    // mais pour simplifier, on va mettre un bouton "Générer EN" à côté du champ EN.
    
    // ATTENTION: L'API ne peut pas deviner si c'est FR ou EN. 
    // Pour ce composant, on va l'utiliser spécifiquement pour le champ ANGLAIS.
    // Le parent devra passer le texte FRANÇAIS en prop ou on le gère différemment.
    
    // CORRECTION DE LOGIQUE POUR L'ADMIN:
    // Le plus simple est d'avoir un bouton "Traduire depuis FR" sur le champ EN.
    // Mais comme le composant ne connaît pas le FR, on va faire appel à une logique externe
    // ou simplement utiliser l'API MyMemory qui détecte souvent la source.
    // MyMemory est assez intelligent pour détecter 'fr' vers 'en'.
    
    try {
      const translated = await translateToEnglish(value);
      onChange(translated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Si le champ est vide, on ne peut pas traduire (ou on pourrait traduire un placeholder, mais inutile)
  // En fait, l'idée est : Je tape en FR -> Je clique sur traduire -> Ça met à jour le champ EN ?
  // NON. Le composant est lié à UN champ.
  // Si je suis sur le champ EN, je veux traduire le texte que je viens de taper ? Non, ça n'a pas de sens.
  
  // RÉALISATION DE L'INTERFACE UX:
  // L'utilisateur tape dans "Description (FR)".
  // À côté de "Description (EN)", il y a un bouton "✨ Auto-fill from FR".
  // Ce bouton doit avoir accès à la valeur FR.
  
  // Pour rendre ce composant universel, on va changer l'approche :
  // On crée un composant "BilingualGroup" qui gère les deux champs et la traduction.
  
  return null; // Placeholder, voir étape 3
};

export default AutoTranslateField;