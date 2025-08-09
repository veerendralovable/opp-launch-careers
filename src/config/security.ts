
// Security configuration
export const SECURITY_CONFIG = {
  // Session security settings
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Enhanced password requirements
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
} as const;

export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} characters long`);
  }
  
  if (SECURITY_CONFIG.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SECURITY_CONFIG.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SECURITY_CONFIG.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SECURITY_CONFIG.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting helper with enhanced security
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number; blocked: boolean }>();
  
  return (identifier: string): { allowed: boolean; remainingAttempts: number; resetTime: number } => {
    const now = Date.now();
    const entry = attempts.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      const newEntry = { count: 1, resetTime: now + windowMs, blocked: false };
      attempts.set(identifier, newEntry);
      return { allowed: true, remainingAttempts: maxAttempts - 1, resetTime: newEntry.resetTime };
    }
    
    if (entry.blocked || entry.count >= maxAttempts) {
      entry.blocked = true;
      return { allowed: false, remainingAttempts: 0, resetTime: entry.resetTime };
    }
    
    entry.count++;
    return { 
      allowed: true, 
      remainingAttempts: maxAttempts - entry.count, 
      resetTime: entry.resetTime 
    };
  };
};

// Input validation helpers
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone.trim());
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  noScripts: (input: string): boolean => {
    const scriptRegex = /<script|javascript:|vbscript:|on\w+\s*=/i;
    return !scriptRegex.test(input);
  }
};
