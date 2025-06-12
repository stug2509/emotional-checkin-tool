// Input validation and sanitization utilities

/**
 * Sanitize text input to prevent XSS attacks
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, 2000); // Limit length
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate feeling description
 */
export const validateFeelingDescription = (description) => {
  const sanitized = sanitizeText(description);
  
  if (!sanitized || sanitized.length < 3) {
    return { isValid: false, error: 'Please describe how you\'re feeling (minimum 3 characters)' };
  }
  
  if (sanitized.length > 500) {
    return { isValid: false, error: 'Description is too long (maximum 500 characters)' };
  }
  
  // Check for inappropriate content (basic filter)
  const inappropriate = ['fuck', 'shit', 'damn']; // Add more as needed
  const hasInappropriate = inappropriate.some(word => 
    sanitized.toLowerCase().includes(word)
  );
  
  if (hasInappropriate) {
    return { isValid: false, error: 'Please keep your description appropriate' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Validate reflection text
 */
export const validateReflection = (reflection) => {
  if (!reflection) return { isValid: true, sanitized: '' }; // Optional field
  
  const sanitized = sanitizeText(reflection);
  
  if (sanitized.length > 1000) {
    return { isValid: false, error: 'Reflection is too long (maximum 1000 characters)' };
  }
  
  return { isValid: true, sanitized };
};

/**
 * Rate limiting helper (basic client-side)
 */
export const checkRateLimit = (key, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get stored requests
  const stored = localStorage.getItem(`rate_limit_${key}`);
  let requests = stored ? JSON.parse(stored) : [];
  
  // Filter out old requests
  requests = requests.filter(timestamp => timestamp > windowStart);
  
  // Check if we're over the limit
  if (requests.length >= maxRequests) {
    return { allowed: false, resetTime: requests[0] + windowMs };
  }
  
  // Add current request
  requests.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(requests));
  
  return { allowed: true };
};

/**
 * Validate emotion data from API
 */
export const validateEmotionData = (emotions) => {
  if (!Array.isArray(emotions)) {
    return { isValid: false, error: 'Invalid emotion data format' };
  }
  
  if (emotions.length === 0) {
    return { isValid: false, error: 'No emotions provided' };
  }
  
  for (const emotion of emotions) {
    if (!emotion.name || typeof emotion.name !== 'string') {
      return { isValid: false, error: 'Invalid emotion name' };
    }
    
    if (!emotion.definition || typeof emotion.definition !== 'string') {
      return { isValid: false, error: 'Invalid emotion definition' };
    }
    
    if (typeof emotion.intensity !== 'number' || emotion.intensity < 1 || emotion.intensity > 10) {
      return { isValid: false, error: 'Invalid emotion intensity' };
    }
  }
  
  return { isValid: true };
};