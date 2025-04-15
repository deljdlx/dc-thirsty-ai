import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for structured code
 */
export default class StructuredCodeRule extends Rule {
    constructor() {
        super(
            "Structured Code",
            (prompt) => {
                // Détecte si le prompt contient du code structuré
                const codePatterns = [
                    // Blocs de code avec accolades/indentation
                    /{\s*[\s\S]*?\s*}/,
                    // Déclarations de fonctions/méthodes
                    /\b(function|class|def|method|const|let|var|import|export)\b/,
                    // Syntaxes spécifiques aux langages courants
                    /(if|else|for|while|switch|case|return|try|catch|async|await)\s*[\({]/,
                    // Lignes avec indentation cohérente (code probable)
                    /\n(\s{2,}|\t)\S+.*\n(\s{2,}|\t)\S+/
                ];
                
                // Vérifie si au moins 2 patterns de code sont présents
                const matchCount = codePatterns.filter(pattern => pattern.test(prompt)).length;
                return matchCount >= 2;
            },
            (prompt) => {
                // Analyse le code pour déterminer sa complexité
                const lines = prompt.split('\n');
                const codeLines = lines.filter(line => line.trim().length > 0);
                
                // Calcul de base proportionnel au nombre de lignes de code
                let waterConsumption = 50 + (codeLines.length * 10);
                
                // Détection de structures complexes
                const nestedStructures = (prompt.match(/[{([][\s\S]*?[{([][\s\S]*?[{([][\s\S]*?[}\])][\s\S]*?[}\])][\s\S]*?[}\])]/g) || []).length;
                const controlStructures = (prompt.match(/\b(if|for|while|switch|try)\b/g) || []).length;
                
                // Ajustements basés sur la complexité
                waterConsumption += nestedStructures * 20; // +20mL par structure imbriquée
                waterConsumption += controlStructures * 5;  // +5mL par structure de contrôle
                
                // Détection d'algorithmes complexes
                const hasComplexAlgo = /sort|search|recursion|optimization|algorithm/.test(prompt.toLowerCase());
                if (hasComplexAlgo) {
                    waterConsumption *= 1.2; // +20% pour algorithmes complexes
                }
                
                return Math.round(waterConsumption);
            },
            "50-500 mL pour du code structuré (50mL + 10mL par ligne de code + complexité)"
        );
    }
}