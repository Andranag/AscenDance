const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Remove any whitespace
  email = email.trim();
  
  // Extract domain
  const domain = email.split('@')[1].toLowerCase();
  
  // Check if domain is in our list of valid domains
  if (!validDomains.includes(domain)) return false;
  
  // Additional checks for common invalid patterns
  if (/\b[a-z]{1}\.[a-z]{1}\.[a-z]{1}\b/i.test(domain)) {
    return false; // Block single letter subdomains
  }
  
  if (/\b[a-z]{1}\.[a-z]{1}\b/i.test(domain)) {
    return false; // Block single letter domains
  }
  
  if (/\b[a-z]{1}\.[a-z]{2,3}\b/i.test(domain)) {
    return false; // Block single letter TLDs
  }
  
  return true;
};

module.exports = {
  isValidEmail,
  validDomains
};