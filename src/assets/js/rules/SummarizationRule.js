import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for summarization tasks
 * Detects when users ask to summarize, condense or abstract text
 */
export default class SummarizationRule extends Rule {
    constructor() {
        super(
            "Summarization Request",
            (prompt) => {
                // Expressions pour détecter les demandes de résumé
                const summarizationVerbs = /\b(résume|résumer|condense|condenser|synthétise|synthétiser|abrège|abréger|simplifie|simplifier)\b/i;
                
                // Termes liés au résumé
                const summarizationTerms = /\b(résumé|synthèse|condensé|abrégé|version courte|grandes lignes|points clés|idées principales|TL;DR|TLDR|en bref)\b/i;
                
                // Expressions indiquant un format ou une longueur de résumé
                const formatIndicators = /\b(en \d+ (mots|lignes|phrases|paragraphes|points|bullet points|puces))\b|\b(résumé (court|bref|concis|succinct))\b/i;
                
                // Présence de contenu à résumer (long texte, URL, etc.)
                const contentToSummarize = /["«»'']([^"«»'']{100,})["«»'']|```([^`]{100,})```|(https?:\/\/[^\s]+)/;
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (summarizationVerbs.test(prompt)) score += 2;
                if (summarizationTerms.test(prompt)) score += 1;
                if (formatIndicators.test(prompt)) score += 1;
                if (contentToSummarize.test(prompt)) score += 2;
                
                // Expressions complètes typiques des demandes de résumé
                if (/\b(peux-tu (résumer|faire un résumé|synthétiser))\b|\b(fais(-moi)? un résumé)\b/i.test(prompt)) {
                    score += 2;
                }
                
                // Seuil minimal pour considérer comme demande de résumé
                return score >= 3;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 120; // Valeur de base pour un résumé standard
                
                // Évaluation de la quantité de texte à résumer
                // Texte entre guillemets, blocs de code ou pages web
                const textMatchQuotes = prompt.match(/["«»'']([^"«»'']{100,})["«»'']/g);
                const textMatchCode = prompt.match(/```([^`]{100,})```/g);
                const urls = prompt.match(/(https?:\/\/[^\s]+)/g);
                
                // Si une URL est détectée, supposer un contenu web moyen
                if (urls && urls.length > 0) {
                    baseWaterUsage += 100; // Résumer une page web demande plus d'effort
                }
                
                // Estimer la longueur du texte à résumer
                let textToSummarize = '';
                if (textMatchQuotes) textToSummarize += textMatchQuotes.join(' ');
                if (textMatchCode) textToSummarize += textMatchCode.join(' ');
                
                // Ajustement selon la longueur du texte à résumer
                const textLength = textToSummarize.length;
                if (textLength > 500) baseWaterUsage += 30;
                if (textLength > 1000) baseWaterUsage += 50;
                if (textLength > 2000) baseWaterUsage += 80;
                if (textLength > 5000) baseWaterUsage += 120;
                
                // Contenu technique ou spécialisé à résumer
                const technicalContent = /\b(technique|scientifique|médical|juridique|légal|académique|financier|informatique|philosophique)\b/i;
                if (technicalContent.test(promptLowerCase)) {
                    baseWaterUsage += 70;
                }
                
                // Formats spécifiques demandés (bullet points, structure, etc.)
                if (/\b(bullet points|puces|structuré|hiérarchisé|plan|table des matières)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 40;
                }
                
                return baseWaterUsage;
            },
            "120-450 mL pour résumer du contenu, variant selon la longueur et la complexité du texte original"
        );
    }
}