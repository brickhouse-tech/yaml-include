/**
 * Generic Template Type Definitions
 */

/**
 * Any valid template value (recursive)
 */
export type TemplateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | TemplateValue[]
  | TemplateObject;

/**
 * Plain template object
 */
export interface TemplateObject {
  [key: string]: TemplateValue;
}

/**
 * Generic template document (YAML/JSON structure)
 */
export interface TemplateDocument {
  [key: string]: any;
}
