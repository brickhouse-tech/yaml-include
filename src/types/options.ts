/**
 * yaml-include Options Type Definitions
 */

/**
 * Scope object for variable substitution
 * Uses prototype chain for efficient child scope creation
 */
export interface Scope {
  [key: string]: unknown;
}

/**
 * Parsed location from URL
 */
export interface ParsedLocation {
  protocol?: string;
  host?: string;
  path?: string;
  relative: boolean;
  raw?: string;
}
