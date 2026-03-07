/**
 * Function registry - maps function names to handlers
 * Generic YAML/JSON preprocessing functions (no CFN-specific stuff)
 */
import type { FnHandler, RecurseFn } from './types.js';

import { createFnMap } from './fn-map.js';
import { createFnLength } from './fn-length.js';
import { createFnInclude } from './fn-include.js';
import {
  createFnFlatten,
  createFnFlattenDeep,
  createFnUniq,
  createFnCompact,
  createFnConcat,
  createFnSort,
  createFnSortedUniq,
  createFnSortBy,
  createFnWithout,
} from './fn-array-ops.js';
import {
  createFnOmit,
  createFnOmitEmpty,
  createFnMerge,
  createFnDeepMerge,
  createFnObjectKeys,
  createFnObjectValues,
  createFnSortObject,
} from './fn-object-ops.js';
import {
  createFnStringify,
  createFnStringSplit,
  createFnUpperCamelCase,
  createFnLowerCamelCase,
} from './fn-string-ops.js';
import {
  createFnGetEnv,
  createFnEval,
  createFnFilenames,
  createFnSequence,
  createFnIfEval,
  createFnJoinNow,
  createFnSubNow,
} from './fn-misc.js';

export interface FnRegistry {
  handlers: Record<string, FnHandler>;
  fnInclude: ReturnType<typeof createFnInclude>['fnInclude'];
}

/**
 * Build function registry with all available handlers
 * @param recurse - The recursion function that processes nested structures
 * @returns Registry with handlers map and fnInclude reference
 */
export function buildRegistry(recurse: RecurseFn): FnRegistry {
  const includeModule = createFnInclude(recurse);

  const handlers: Record<string, FnHandler> = {
    // Core
    'Fn::Include': includeModule.handleFnIncludeInRecurse,
    'Fn::Map': createFnMap(recurse),
    'Fn::Length': createFnLength(recurse),

    // Array operations
    'Fn::Flatten': createFnFlatten(recurse),
    'Fn::FlattenDeep': createFnFlattenDeep(recurse),
    'Fn::Uniq': createFnUniq(recurse),
    'Fn::Compact': createFnCompact(recurse),
    'Fn::Concat': createFnConcat(recurse),
    'Fn::Sort': createFnSort(recurse),
    'Fn::SortedUniq': createFnSortedUniq(recurse),
    'Fn::SortBy': createFnSortBy(recurse),
    'Fn::Without': createFnWithout(recurse),

    // Object operations
    'Fn::Omit': createFnOmit(recurse),
    'Fn::OmitEmpty': createFnOmitEmpty(recurse),
    'Fn::Merge': createFnMerge(recurse),
    'Fn::DeepMerge': createFnDeepMerge(recurse),
    'Fn::ObjectKeys': createFnObjectKeys(recurse),
    'Fn::ObjectValues': createFnObjectValues(recurse),
    'Fn::SortObject': createFnSortObject(recurse),

    // String operations
    'Fn::Stringify': createFnStringify(recurse),
    'Fn::StringSplit': createFnStringSplit(recurse),
    'Fn::UpperCamelCase': createFnUpperCamelCase(),
    'Fn::LowerCamelCase': createFnLowerCamelCase(),

    // Miscellaneous generic functions
    'Fn::GetEnv': createFnGetEnv(),
    'Fn::Eval': createFnEval(recurse),
    'Fn::Filenames': createFnFilenames(recurse),
    'Fn::Sequence': createFnSequence(recurse),
    'Fn::IfEval': createFnIfEval(recurse),
    'Fn::JoinNow': createFnJoinNow(recurse),
    'Fn::SubNow': createFnSubNow(recurse),
  };

  return { handlers, fnInclude: includeModule.fnInclude };
}
