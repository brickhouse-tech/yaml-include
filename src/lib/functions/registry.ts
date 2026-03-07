import type { FnHandler, RecurseFn } from './types.js';

import { createFnMap } from './fn-map.js';
import { createFnLength } from './fn-length.js';
import { createFnInclude } from './fn-include.js';
import { createFnFlatten, createFnFlattenDeep, createFnUniq, createFnCompact, createFnConcat, createFnSort, createFnSortedUniq, createFnSortBy, createFnWithout } from './fn-array-ops.js';
import { createFnOmit, createFnOmitEmpty, createFnMerge, createFnDeepMerge, createFnObjectKeys, createFnObjectValues, createFnSortObject } from './fn-object-ops.js';
import { createFnStringify, createFnStringSplit, createFnUpperCamelCase, createFnLowerCamelCase, createFnJoinNow, createFnSubNow } from './fn-string-ops.js';
// TODO: Uncomment when fn-misc.ts is available (generic functions only)
// import { createFnGetEnv, createFnEval, createFnFilenames, createFnSequence, createFnIfEval } from './fn-misc.js';

export interface FnRegistry {
  handlers: Record<string, FnHandler>;
  fnInclude: ReturnType<typeof createFnInclude>['fnInclude'];
}

export function buildRegistry(recurse: RecurseFn): FnRegistry {
  const includeModule = createFnInclude(recurse);

  const handlers: Record<string, FnHandler> = {
    // Core generic functions
    'Fn::Map': createFnMap(recurse),
    'Fn::Length': createFnLength(recurse),
    'Fn::Include': includeModule.handleFnIncludeInRecurse,
    
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
    'Fn::JoinNow': createFnJoinNow(recurse),
    'Fn::SubNow': createFnSubNow(recurse),
    
    // TODO: Add when fn-misc.ts is available:
    // 'Fn::GetEnv': createFnGetEnv(),
    // 'Fn::Eval': createFnEval(recurse),
    // 'Fn::Filenames': createFnFilenames(recurse),
    // 'Fn::Sequence': createFnSequence(recurse),
    // 'Fn::IfEval': createFnIfEval(recurse),
    
    // Removed AWS-specific functions:
    // - Fn::Outputs (AWS CloudFormation)
    // - Fn::RefNow (AWS CloudFormation)
    // - Fn::ApplyTags (AWS CloudFormation)
  };

  return { handlers, fnInclude: includeModule.fnInclude };
}
