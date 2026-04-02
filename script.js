// =============================================
// FAQ DATA — Questions and Answers
// =============================================
const FAQ_DATA = [
  // General
  {
    question: "What is this service?",
    answer: "We are an online platform that provides high-quality software development, AI tools, and digital solutions to businesses and individuals.",
    category: "General"
  },
  {
    question: "How can I contact support?",
    answer: "You can contact our support team via email at support@company.com or call us at +1-800-123-4567. We are available 24/7!",
    category: "Support"
  },
  {
    question: "What are your working hours?",
    answer: "Our support team is available 24 hours a day, 7 days a week including weekends and holidays.",
    category: "General"
  },
  {
    question: "Where is your company located?",
    answer: "Our headquarters is located in New York, USA. We also have offices in London, Tokyo, and Bangalore.",
    category: "General"
  },

  // Account
  {
    question: "How do I create an account?",
    answer: "Click on the Sign Up button on our homepage, fill in your name, email, and password, then verify your email to get started!",
    category: "Account"
  },
  {
    question: "How do I reset my password?",
    answer: "Click on Forgot Password on the login page, enter your registered email, and we will send you a password reset link within 2 minutes.",
    category: "Account"
  },
  {
    question: "Can I change my email address?",
    answer: "Yes! Go to Account Settings, click on Edit Profile, and update your email address. You will need to verify the new email.",
    category: "Account"
  },
  {
    question: "How do I delete my account?",
    answer: "To delete your account, go to Account Settings and click Delete Account. Please note this action is permanent and cannot be undone.",
    category: "Account"
  },

  // Pricing
  {
    question: "How much does it cost?",
    answer: "We offer 3 plans: Free (basic features), Pro at $9.99/month, and Enterprise at $29.99/month. All plans come with a 14-day free trial!",
    category: "Pricing"
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Every plan comes with a 14-day free trial. No credit card is required to start your trial.",
    category: "Pricing"
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you are not satisfied, contact us within 30 days of purchase for a full refund.",
    category: "Pricing"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, American Express, PayPal, and UPI payments. All transactions are secured with SSL encryption.",
    category: "Pricing"
  },

  // Technical
  {
    question: "What browsers are supported?",
    answer: "Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for best performance.",
    category: "Technical"
  },
  {
    question: "Is there a mobile app?",
    answer: "Yes! Our mobile app is available on both iOS (App Store) and Android (Google Play Store). Download it for free today!",
    category: "Technical"
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! We use 256-bit SSL encryption, two-factor authentication, and regular security audits to keep your data safe.",
    category: "Technical"
  },
  {
    question: "How do I report a bug?",
    answer: "You can report bugs by emailing bugs@company.com or using the Report Issue button inside the app. We typically fix bugs within 24-48 hours.",
    category: "Technical"
  },

  // Features
  {
    question: "What features are included in the free plan?",
    answer: "The free plan includes up to 5 projects, 1GB storage, basic analytics, and email support. Upgrade to Pro for unlimited access!",
    category: "Features"
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! Our Pro and Enterprise plans support team collaboration. You can invite team members, assign roles, and work together in real time.",
    category: "Features"
  },
  {
    question: "Does it support multiple languages?",
    answer: "Yes, our platform supports over 30 languages including English, Hindi, Telugu, Spanish, French, German, Chinese, and Japanese.",
    category: "Features"
  },
  {
    question: "Can I export my data?",
    answer: "Yes! You can export your data in CSV, PDF, or Excel format anytime from your dashboard under Settings > Export Data.",
    category: "Features"
  },
];

// =============================================
// NLP HELPER FUNCTIONS
// =============================================

// Tokenize: split text into individual words
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 0);
}

// Remove stopwords (common words that don't add meaning)
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "may", "might", "shall", "can",
  "i", "me", "my", "we", "our", "you", "your", "it", "its",
  "this", "that", "these", "those", "and", "or", "but", "in",
  "on", "at", "to", "for", "of", "with", "about", "how", "what",
  "when", "where", "who", "why", "which", "there", "their"
]);

function removeStopwords(tokens) {
  return tokens.filter(token => !STOPWORDS.has(token));
}

// Build word frequency vector
function buildVector(tokens) {
  const vector = {};
  tokens.forEach(token => {
    vector[token] = (vector[token] || 0) + 1;
  });
  return vector;
}

// Cosine Similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  let dotProduct  = 0;
  let magnitudeA  = 0;
  let magnitudeB  = 0;

  allWords.forEach(word => {
    const a = vecA[word] || 0;
    const b = vecB[word] || 0;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  });

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

// Find best matching FAQ
function findBestMatch(userQuestion) {
  const userTokens  = removeStopwords(tokenize(userQuestion));
  const userVector  = buildVector(userTokens);

  let bestMatch     = null;
  let bestScore     = 0;

  FAQ_DATA.forEach(faq => {
    const faqTokens  = removeStopwords(tokenize(faq.question));
    const faqVector  = buildVector(faqTokens);
    const score      = cosineSimilarity(userVector, faqVector);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  });

  return { match: bestMatch, score: bestScore };
}

// =============================================
// CHAT UI
// =============================================

const chatWindow = document.getElementById("chatWindow");
const userInput  = document.getElementById("userInput");
const sendBtn    = document.getElementById("sendBtn");
const suggestBtns = document.getElementById("suggestBtns");

// Show 5 suggested questions on load
const suggestions = [
  "How do I reset my password?",
  "Is there a free trial?",
  "Is my data secure?",
  "How can I contact support?",
  "What features are in the free plan?",
];

suggestions.forEach(q => {
  const btn = document.createElement("button");
  btn.className   = "suggest-btn";
  btn.textContent = q;
  btn.addEventListener("click", () => {
    userInput.value = q;
    handleSend();
  });
  suggestBtns.appendChild(btn);
});

// Add message to chat window
function addMessage(text, type, confidence = null) {
  const msgDiv    = document.createElement("div");
  msgDiv.className = `message ${type === "user" ? "user-msg" : "bot-msg"}`;

  const avatar = document.createElement("span");
  avatar.className  = "avatar";
  avatar.textContent = type === "user" ? "🧑" : "🤖";

  const bubble = document.createElement("div");
  bubble.className  = "bubble";
  bubble.textContent = text;

  if (confidence !== null) {
    const badge = document.createElement("span");
    badge.className   = "confidence";
    badge.textContent = `Match confidence: ${Math.round(confidence * 100)}%`;
    bubble.appendChild(badge);
  }

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatWindow.appendChild(msgDiv);

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show typing indicator
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot-msg typing";
  typingDiv.id        = "typingIndicator";

  const avatar = document.createElement("span");
  avatar.className  = "avatar";
  avatar.textContent = "🤖";

  const bubble = document.createElement("div");
  bubble.className  = "bubble";
  bubble.textContent = "Typing...";

  typingDiv.appendChild(avatar);
  typingDiv.appendChild(bubble);
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

// Handle send
function handleSend() {
  const question = userInput.value.trim();
  if (!question) return;

  // Show user message
  addMessage(question, "user");
  userInput.value = "";

  // Show typing
  showTyping();

  // Simulate thinking delay
  setTimeout(() => {
    removeTyping();

    const { match, score } = findBestMatch(question);

    if (match && score > 0.1) {
      addMessage(match.answer, "bot", score);
    } else {
      addMessage(
        "I'm sorry, I couldn't find a matching answer. Please try rephrasing your question, or contact our support team at support@company.com",
        "bot"
      );
    }
  }, 800);
}

// Send button click
sendBtn.addEventListener("click", handleSend);

// Enter key to send
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});