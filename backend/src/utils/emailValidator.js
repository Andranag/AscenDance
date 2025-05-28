const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
const invalidDomainPatterns = [
  /^.*\.(com|net|org)$/i,  // Block single letter domains
  /^.*\.(com\.com|net\.com|org\.com)$/i,  // Block double extensions
  /^.*\.[a-z]{1}$/i,  // Block single letter TLDs
  /^.*\.[a-zA-Z0-9]{2,3}\.[a-z]{1}$/i,  // Block single letter subdomains
  /^.*\.[a-z]{1}\.[a-zA-Z0-9]{2,3}$/i,  // Block single letter domains
  /^.*\.[a-z]{1}\.[a-z]{1}\.[a-zA-Z0-9]{2,3}$/i  // Block single letter subdomains
];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  // Remove any whitespace
  email = email.trim();

  // Extract domain first
  const parts = email.split('@');
  if (parts.length !== 2) return false; // Must have exactly one @
  
  const domain = parts[1].toLowerCase();
  
  // Check against invalid domain patterns immediately
  for (const pattern of invalidDomainPatterns) {
    if (pattern.test(domain)) {
      return false;
    }
  }
  
  // Check if domain is in our list of valid domains
  if (!validDomains.includes(domain)) return false;
  
  // Basic email format validation with stricter regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  
  return true;
};

module.exports = {
  isValidEmail
};
