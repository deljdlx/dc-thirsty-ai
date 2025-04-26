import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for data processing tasks
 * Detects when users ask for data processing, analysis, or manipulation
 */
export default class DataProcessingRule extends Rule {
    constructor() {
        super(
            "Data Processing",
            (prompt) => {
                // Termes liés au traitement de données
                const dataTerms = /\b(données|data|dataset|jeu de données|table|csv|excel|base de données|SQL|database)\b/i;
                
                // Actions sur des données
                const dataActions = /\b(traite|analyse|classe|classifie|filtre|transforme|organise|agrège|trie|groupe|regroupe|résume|synthétise)\b/i;
                
                // Types d'analyses
                const analysisTypes = /\b(clustering|classification|régression|prédiction|machine learning|apprentissage|statistique|corrélation|tendance|pattern|modèle prédictif)\b/i;
                
                // Formats de données mentionnés
                const dataFormats = /\b(JSON|XML|CSV|SQL|API|fichier plat|tableau|matrice|graphe|graphique)\b/i;
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (dataTerms.test(prompt)) score += 1;
                if (dataActions.test(prompt)) score += 1;
                if (analysisTypes.test(prompt)) score += 2;
                if (dataFormats.test(prompt)) score += 1;
                
                // Bonus pour les phrases qui combinent action et données
                const combinedPhrases = new RegExp(`(${dataActions.source.slice(2, -2)}).{0,15}(${dataTerms.source.slice(2, -2)})`, 'i');
                if (combinedPhrases.test(prompt)) score += 2;
                
                // Seuil minimal pour considérer comme traitement de données
                return score >= 3;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 180; // Valeur de base pour le traitement de données
                
                // Facteurs d'augmentation selon le volume de données suggéré
                if (/\b(grand|importante|massive|volumineuse|big data|téraoctet|gigaoctet|million|milliard)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 120; // Grandes quantités de données
                }
                
                // Facteurs d'augmentation selon la complexité de l'analyse
                if (/\b(complexe|sophistiqué|avancé|machine learning|deep learning|apprentissage profond|réseau de neurones|intelligence artificielle)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 150;
                }
                
                // Analyses en temps réel sont plus intensives
                if (/\b(temps réel|temps-réel|real-time|streaming|flux continu)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 100;
                }
                
                return baseWaterUsage;
            },
            "180-450 mL pour le traitement et l'analyse de données, selon le volume et la complexité"
        );
    }
}