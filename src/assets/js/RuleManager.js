// filepath: /home/jdlxt/__dev/experiments/waterai/assets/js/RuleManager.js

/**
 * Classe pour gérer un ensemble de règles d'estimation de consommation d'eau
 * Permet de gérer la logique inter-règles et fournit des méthodes utilitaires
 */
export default class RuleManager {
    /**
     * Construit un gestionnaire de règles
     */
    constructor() {
        this.rules = [];
    }

    /**
     * Ajoute une règle au gestionnaire
     * @param {Rule} rule - La règle à ajouter
     * @returns {RuleManager} - Le gestionnaire lui-même (pour le chaînage)
     */
    addRule(rule) {
        this.rules.push(rule);
        return this; // Pour le chaînage (fluent interface)
    }

    /**
     * Ajoute plusieurs règles au gestionnaire
     * @param {Array<Rule>} rules - Un tableau de règles à ajouter
     * @returns {RuleManager} - Le gestionnaire lui-même (pour le chaînage)
     */
    addRules(rules) {
        rules.forEach(rule => this.rules.push(rule));
        return this; // Pour le chaînage
    }

    /**
     * Récupère toutes les règles
     * @returns {Array<Rule>} - Tableau de toutes les règles
     */
    getAllRules() {
        return this.rules;
    }

    /**
     * Récupère une règle par son nom
     * @param {string} name - Nom de la règle à chercher
     * @returns {Rule|null} - La règle trouvée ou null si aucune correspondance
     */
    getRuleByName(name) {
        return this.rules.find(rule => rule.name === name) || null;
    }

    /**
     * Évalue un prompt avec toutes les règles actives
     * @param {string} prompt - Le prompt à évaluer
     * @returns {Array<Object>} - Tableau des résultats de chaque règle applicable
     */
    evaluatePrompt(prompt) {
        return this.rules
            .filter(rule => rule.applies(prompt))
            .map(rule => ({
                name: rule.name,
                description: rule.description,
                waterUsage: rule.calculateWaterUsage(prompt)
            }));
    }

    /**
     * Calcule la consommation d'eau totale pour un prompt donné
     * @param {string} prompt - Le prompt à évaluer
     * @returns {number} - Consommation d'eau totale en mL
     */
    calculateTotalWaterUsage(prompt) {
        const ruleResults = this.evaluatePrompt(prompt);
        return ruleResults.reduce((total, result) => total + result.waterUsage, 0);
    }

    /**
     * Trouve les règles ayant la plus grande contribution à la consommation d'eau
     * @param {string} prompt - Le prompt à évaluer
     * @param {number} count - Nombre de règles à retourner (défaut: 3)
     * @returns {Array<Object>} - Les règles principales contribuant à la consommation
     */
    findTopContributingRules(prompt, count = 3) {
        return this.evaluatePrompt(prompt)
            .sort((a, b) => b.waterUsage - a.waterUsage)
            .slice(0, count);
    }
    
    /**
     * Détermine si un prompt dépasse un certain seuil de consommation d'eau
     * @param {string} prompt - Le prompt à évaluer
     * @param {number} threshold - Seuil de consommation en mL
     * @returns {boolean} - Vrai si le prompt dépasse le seuil
     */
    exceedsThreshold(prompt, threshold) {
        return this.calculateTotalWaterUsage(prompt) > threshold;
    }
}