import RuleManager from './RuleManager.js';
import PromptSizeRule from './rules/PromptSizeRule.js';
import ComplexWordsRule from './rules/ComplexWordsRule.js';
import ImageGenerationRule from './rules/ImageGenerationRule.js';
import TechnicalContentRule from './rules/TechnicalContentRule.js';
import StructuredCodeRule from './rules/StructuredCodeRule.js';
import LongPromptRule from './rules/LongPromptRule.js';
import AnalyticalIntentRule from './rules/AnalyticalIntentRule.js';
import ForeignCharsetRule from './rules/ForeignCharsetRule.js';

/**
 * Instance de RuleManager avec les règles par défaut
 * RuleManager gère la logique inter-règles et fournit des méthodes utilitaires
 */
const ruleManager = new RuleManager();

// Ajout de toutes les règles
ruleManager
  // 🧮 Rule 1 : Prompt Size - Estimation de la taille en tokens
  .addRule(new PromptSizeRule())
  
  // 🔠 Rule 2 : Complex Words - Détection de mots complexes
  .addRule(new ComplexWordsRule())
  
  // 🖼️ Rule 3 : Image Generation - Requêtes de génération d'image
  .addRule(new ImageGenerationRule())
  
  // 🔧 Rule 4 : Technical Content - Contenu technique
  .addRule(new TechnicalContentRule())
  
  // 📐 Rule 5 : Structured Code - Structure de code
  .addRule(new StructuredCodeRule())
  
  // 📏 Rule 6 : Long Prompt - Version améliorée
  .addRule(new LongPromptRule())
  
  // 🧠 Rule 7 : Analytical Intent - Tâche cognitive
  .addRule(new AnalyticalIntentRule())
  
  // 🌍 Rule 8 : Foreign or Extended Charset - Caractères non-ASCII
  .addRule(new ForeignCharsetRule());

// Export du gestionnaire de règles au lieu du tableau
export default ruleManager;