// filepath: /home/jdlxt/__dev/experiments/waterai/waterEstimator.js

// Import classes from separate modules
import ThirstyAI from './assets/js/ThirstyAI.js';
import Rule from './assets/js/Rule.js';
import defaultRules from './assets/js/defaultRules.js';
import RuleManager from './assets/js/RuleManager.js';

// Export classes and rules for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThirstyAI, Rule, defaultRules, RuleManager };
} else {
    // For browser context, expose to global scope
    window.ThirstyAI = ThirstyAI;
    window.Rule = Rule;
    window.defaultRules = defaultRules;
    window.RuleManager = RuleManager;
}