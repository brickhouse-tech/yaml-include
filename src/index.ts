/**
 * yaml-include - Generic YAML/JSON preprocessor
 * Core engine extracted from cfn-include
 */
import _ from 'lodash';

import parseLocation from './lib/parselocation.js';
import replaceEnv from './lib/replaceEnv.js';
import { createChildScope } from './lib/scope.js';
import { promiseProps } from './lib/promise-utils.js';
import { buildRegistry } from './lib/functions/registry.js';
import { getBoolEnvOpt } from './lib/functions/helpers.js';
import type { RecurseContext } from './lib/functions/types.js';
import { MAX_RECURSE_DEPTH } from './lib/functions/types.js';

import type {
  Scope,
  TemplateValue,
  TemplateDocument,
  TemplateObject,
} from './types/index.js';

// --- Exported Types ---

/**
 * Options for the include() function
 */
export interface IncludeOptions {
  /** Template URL to load (required) */
  url: string;
  /** Pre-loaded template (optional, will be processed if provided) */
  template?: TemplateValue;
  /** Variable scope for template processing */
  scope?: Scope;
  /** Enable environment variable substitution (default: false) */
  doEnv?: boolean;
  /** Enable eval operations (default: false) */
  doEval?: boolean;
  /** Key-value pairs for variable injection */
  inject?: Record<string, string>;
  /** Enable debug logging (default: false) */
  doLog?: boolean;
}

export type { TemplateDocument, TemplateValue };

// --- Registry & Recursion ---

let registry: ReturnType<typeof buildRegistry>;

/**
 * Recursively process template structures, dispatching to registered function handlers
 * @param ctx - Recursion context with template, scope, and options
 * @returns Processed template value
 */
async function recurse(ctx: RecurseContext): Promise<any> {
  const { base, scope: initialScope, cft, rootTemplate, caller, depth = 0, ...opts } = ctx;
  let scope = initialScope;

  if (depth > MAX_RECURSE_DEPTH) {
    throw new Error(`Maximum recursion depth (${MAX_RECURSE_DEPTH}) exceeded at caller: ${caller}`);
  }

  if (opts.doLog) {
    console.log({ base, scope, cft, rootTemplate, caller, ...opts });
  }

  scope = createChildScope(scope);

  const nextDepth = depth + 1;

  // Handle arrays
  if (Array.isArray(cft)) {
    return Promise.all(
      cft.map((o) => recurse({ base, scope, cft: o, rootTemplate, caller: 'recurse:isArray', depth: nextDepth, ...opts })),
    );
  }

  // Handle objects - check for registered function handlers
  if (_.isPlainObject(cft)) {
    const obj = cft as TemplateObject;

    // Dispatch to registered handler if function name matches
    for (const fnName of Object.keys(obj)) {
      const handler = registry.handlers[fnName];
      if (handler) {
        return handler({ base, scope, cft, rootTemplate, caller, depth: nextDepth, ...opts });
      }
    }

    // No handler found - process all properties recursively
    return promiseProps(
      _.mapValues(obj, (template, key) =>
        recurse({ base, scope, cft: template, key, rootTemplate, caller: 'recurse:isPlainObject:end', depth: nextDepth, ...opts }),
      ),
    );
  }

  // Handle undefined
  if (cft === undefined) {
    return null;
  }

  // Handle primitives - apply environment variable replacement
  return replaceEnv(cft, opts.inject, opts.doEnv) as TemplateValue;
}

// Initialize registry with recurse function
registry = buildRegistry(recurse);

// --- Main Export ---

/**
 * Main entry point for yaml-include template processing
 * 
 * Loads and processes YAML/JSON templates with support for:
 * - Fn::Include for loading external files
 * - Custom function handlers (Fn::Map, Fn::Merge, etc.)
 * - Environment variable substitution
 * - Variable scope and injection
 * 
 * @param options - Include options (url, template, scope, etc.)
 * @returns Processed template
 * 
 * @example
 * ```typescript
 * const result = await include({
 *   url: 'file://./template.yaml',
 *   doEnv: true,
 *   scope: { version: '1.0' }
 * });
 * ```
 */
export default async function include(options: IncludeOptions): Promise<any> {
  let { template } = options;
  const doEnv = getBoolEnvOpt(options.doEnv, 'YAML_INCLUDE_DO_ENV');
  const doEval = getBoolEnvOpt(options.doEval, 'YAML_INCLUDE_DO_EVAL');

  const base = parseLocation(options.url);
  const scope: Scope = options.scope || {};
  if (base.relative) throw new Error('url cannot be relative');

  // Load template if not provided
  const processedTemplate = !template
    ? registry.fnInclude({ ...options, base, scope, cft: options.url, doEnv, doEval })
    : template;

  const resolvedTemplate = await Promise.resolve(processedTemplate);
  
  // Process template recursively
  return recurse({
    base,
    scope,
    cft: resolvedTemplate,
    rootTemplate: resolvedTemplate as TemplateDocument,
    doEnv,
    doEval,
    doLog: options.doLog,
    inject: options.inject,
  });
}
