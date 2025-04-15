// filepath: /home/jdlxt/__dev/experiments/waterai/assets/js/rules/ForeignCharsetRule.js
import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for non-ASCII characters and foreign scripts
 */
export default class ForeignCharsetRule extends Rule {
    constructor() {
        super(
            "Foreign or Extended Charset",
            (prompt) => {
                // Détection plus intelligente du contenu multilingue ou spécial
                const nonAsciiChars = prompt.match(/[^\x00-\x7F]/g) || [];
                
                // Ignorer les emojis isolés qui ne sont pas du vrai contenu multilingue
                const emojiPattern = /[\u{1F000}-\u{1F6FF}\u{2700}-\u{27BF}]/u;
                const nonEmojiNonAscii = nonAsciiChars.filter(char => !emojiPattern.test(char));
                
                // Seuil de caractères non-ASCII significatifs (pas juste quelques accents isolés)
                const significantNonAscii = nonEmojiNonAscii.length > 5;
                
                // Détection spécifique des scripts non-latins (plus de traitement)
                const nonLatinScripts = /[\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/;
                const hasNonLatinScript = nonLatinScripts.test(prompt);
                
                return significantNonAscii || hasNonLatinScript;
            },
            (prompt) => {
                // Base pour traitement de caractères spéciaux
                let waterUsage = 50;
                
                // Détection de scripts spécifiques qui demandent plus de ressources
                const scriptDetection = {
                    cyrillic: /[\u0400-\u04FF]/, // Cyrillique
                    arabic: /[\u0600-\u06FF]/, // Arabe
                    devanagari: /[\u0900-\u097F]/, // Devanagari (hindi, etc.)
                    chinese: /[\u3400-\u4DBF\u4E00-\u9FFF]/, // Chinois
                    japanese: /[\u3040-\u309F\u30A0-\u30FF]/, // Japonais
                    korean: /[\uAC00-\uD7AF]/ // Coréen
                };
                
                // Ajout selon les scripts détectés (plus complexes = plus d'eau)
                if (scriptDetection.chinese.test(prompt) || scriptDetection.japanese.test(prompt)) {
                    waterUsage += 50; // Traitement des caractères CJK très complexe
                } else if (scriptDetection.arabic.test(prompt) || scriptDetection.devanagari.test(prompt)) {
                    waterUsage += 30; // Scripts bidirectionnels ou complexes
                } else if (scriptDetection.cyrillic.test(prompt) || scriptDetection.korean.test(prompt)) {
                    waterUsage += 20; // Scripts modérément complexes
                }
                
                // Mélange de plusieurs scripts = encore plus complexe
                const scriptCount = Object.values(scriptDetection).filter(regex => regex.test(prompt)).length;
                if (scriptCount > 1) {
                    waterUsage += 40; // Traitement multilingue complexe
                }
                
                return waterUsage;
            },
            "50-140 mL pour contenu multilingue ou utilisant des caractères spéciaux, selon les scripts utilisés"
        );
    }
}