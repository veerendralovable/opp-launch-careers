
import DOMPurify from 'dompurify';

// Configure DOMPurify for maximum security
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'a', 'img', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'
  ],
  ALLOWED_URI_REGEXP: /^https?:\/\/|^mailto:|^tel:/i,
  ADD_ATTR: ['target', 'rel'],
  FORBID_SCRIPTS: true,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
};

export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // First pass: basic sanitization
    let sanitized = DOMPurify.sanitize(html, purifyConfig);
    
    // Second pass: additional security measures
    sanitized = sanitized
      // Remove any remaining script-like content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      // Remove javascript: URLs
      .replace(/javascript:/gi, '')
      // Remove data: URLs (except safe image types)
      .replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg\+xml))[^"']*/gi, '')
      // Remove vbscript: URLs
      .replace(/vbscript:/gi, '')
      // Remove on* event handlers that might have been missed
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    return sanitized;
  } catch (error) {
    console.error('HTML sanitization error:', error);
    // Return empty string if sanitization fails
    return '';
  }
};

export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    
    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};
