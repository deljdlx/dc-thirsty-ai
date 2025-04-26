import RuleManager from './RuleManager.js';
import PromptSizeRule from './rules/PromptSizeRule.js';
import ComplexWordsRule from './rules/ComplexWordsRule.js';
import ImageGenerationRule from './rules/ImageGenerationRule.js';
import TechnicalContentRule from './rules/TechnicalContentRule.js';
import StructuredCodeRule from './rules/StructuredCodeRule.js';
import LongPromptRule from './rules/LongPromptRule.js';
import AnalyticalIntentRule from './rules/AnalyticalIntentRule.js';
import ForeignCharsetRule from './rules/ForeignCharsetRule.js';
import CreationRequestRule from './rules/CreationRequestRule.js';
import MathematicalComputationRule from './rules/MathematicalComputationRule.js';
import DataProcessingRule from './rules/DataProcessingRule.js';
import TranslationRule from './rules/TranslationRule.js';
import SummarizationRule from './rules/SummarizationRule.js';
import CreativeWritingRule from './rules/CreativeWritingRule.js';
import NonsensicalPromptRule from './rules/NonsensicalPromptRule.js';

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
  .addRule(new ForeignCharsetRule())
  
  // 🏗️ Rule 9 : Creation Request - Demandes de création
  .addRule(new CreationRequestRule())
  
  // 🧪 Rule 10 : Mathematical Computation - Calculs mathématiques
  .addRule(new MathematicalComputationRule())
  
  // 📊 Rule 11 : Data Processing - Traitement de données
  .addRule(new DataProcessingRule())
  
  // 🔄 Rule 12 : Translation - Demandes de traduction
  .addRule(new TranslationRule())
  
  // 📝 Rule 13 : Summarization - Demandes de résumé
  .addRule(new SummarizationRule())
  
  // 📚 Rule 14 : Creative Writing - Écriture créative
  .addRule(new CreativeWritingRule())
  
  // 🤪 Rule 15 : Nonsensical Prompt - Prompts "débiles" ou sans sens
  .addRule(new NonsensicalPromptRule());

// Export du gestionnaire de règles au lieu du tableau
export default ruleManager;