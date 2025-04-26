import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for translation requests
 * Detects when users ask for translations between languages
 */
export default class TranslationRule extends Rule {
    constructor() {
        super(
            "Translation Request",
            (prompt) => {
                // Expressions pour détecter les demandes de traduction
                const translationVerbs = /\b(traduis|traduire|translate|convertir|convertis)\b/i;
                
                // Mentions de langues
                const languageTerms = /\b(français|anglais|espagnol|allemand|italien|portugais|russe|chinois|japonais|arabe|latin|grec|hébreu|hindi|coréen|en français|en anglais|en espagnol)\b/i;
                
                // Expressions complètes de traduction
                const translationPhrases = /\b(traduis.{0,50}(en|vers|du|de|d'|l'|la|le))|((du|de|d'|l'|la|le).{0,10}(au|vers|en).{0,10})\b/i;
                
                // Identificateurs de contenu à traduire
                const contentIndicators = /["«»'']([^"«»'']{10,})["«»'']|```([^`]{10,})```/;
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (translationVerbs.test(prompt)) score += 2;
                if (languageTerms.test(prompt)) score += 1;
                if (translationPhrases.test(prompt)) score += 2;
                if (contentIndicators.test(prompt)) score += 1;
                
                // Phrases directes comme "Français vers Anglais" ou "English to French"
                const directTranslation = /\b([a-zA-Z]+)\s+(vers|to|en|into)\s+([a-zA-Z]+)\b/i;
                if (directTranslation.test(prompt)) score += 2;
                
                // Seuil minimal pour considérer comme demande de traduction
                return score >= 3;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 100; // Valeur de base pour une traduction simple
                
                // Volume de texte à traduire (détecter du texte entre guillemets ou blocs de code)
                const textMatchQuotes = prompt.match(/["«»'']([^"«»'']{10,})["«»'']/g);
                const textMatchCode = prompt.match(/```([^`]{10,})```/g);
                
                let textToTranslate = '';
                if (textMatchQuotes) textToTranslate += textMatchQuotes.join(' ');
                if (textMatchCode) textToTranslate += textMatchCode.join(' ');
                
                // Si pas de texte délimité clairement, on prend la longueur totale
                const textLength = textToTranslate.length > 0 ? textToTranslate.length : prompt.length;
                
                // Ajustement selon la longueur du texte
                if (textLength > 500) baseWaterUsage += 50;
                if (textLength > 1000) baseWaterUsage += 50; // Cumulatif avec le précédent
                if (textLength > 2000) baseWaterUsage += 100;
                
                // Langues rares ou complexes (plus difficiles à traduire)
                const complexLanguages = /\b(chinois|japonais|arabe|russe|coréen|hindi|hébreu|grec|latin|sanskrit)\b/i;
                if (complexLanguages.test(promptLowerCase)) {
                    baseWaterUsage += 80;
                }
                
                // Traduction technique ou spécialisée
                const technicalContent = /\b(technique|scientifique|médical|juridique|légal|académique|financier|informatique|code)\b/i;
                if (technicalContent.test(promptLowerCase)) {
                    baseWaterUsage += 70;
                }
                
                return baseWaterUsage;
            },
            "100-400 mL pour les demandes de traduction, variant selon le volume de texte et la complexité des langues"
        );
    }
}