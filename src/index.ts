/**
 * yaml-include - Generic YAML/JSON preprocessor
 * Core engine extracted from cfn-include
 */

export interface IncludeOptions {
  url: string;
  template?: any;
  scope?: Record<string, any>;
  doEnv?: boolean;
  doEval?: boolean;
  inject?: Record<string, string>;
  doLog?: boolean;
}

export async function include(options: IncludeOptions): Promise<any> {
  // TODO: Implement core include engine
  throw new Error('Not yet implemented - scaffolding in progress');
}

export { IncludeOptions as Options };
