/**
 * yaml-include Options Type Definitions
 */

import type { TemplateDocument, TemplateValue } from './template.js';

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

/**
 * Pseudo-parameters for template variable substitution
 */
export interface AwsPseudoParameters {
  [key: string]: string;
}
