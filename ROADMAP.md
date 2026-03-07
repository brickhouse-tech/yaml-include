# yaml-include Roadmap

## Phase 1: Core Engine Extraction (Week 1)

**Extract from cfn-include:**
- [x] Project scaffold
- [ ] Core include engine (`src/lib/include.ts`)
- [ ] YAML/JSON parsing (`src/lib/yaml.ts`)
- [ ] HTTP/file loading (`src/lib/request.ts`)
- [ ] Template variables (`src/lib/replaceEnv.ts`)
- [ ] Scope management (`src/lib/scope.ts`)
- [ ] Recursion handler
- [ ] Cache system

## Phase 2: Generic Functions (Week 1-2)

**Array operations:**
- [ ] Fn::Flatten, Fn::FlattenDeep
- [ ] Fn::Uniq, Fn::Compact
- [ ] Fn::Concat, Fn::Sort, Fn::SortedUniq, Fn::SortBy
- [ ] Fn::Without

**Object operations:**
- [ ] Fn::Merge, Fn::DeepMerge
- [ ] Fn::Omit, Fn::OmitEmpty
- [ ] Fn::ObjectKeys, Fn::ObjectValues
- [ ] Fn::SortObject

**String operations:**
- [ ] Fn::Stringify, Fn::StringSplit
- [ ] Fn::UpperCamelCase, Fn::LowerCamelCase
- [ ] Fn::JoinNow, Fn::SubNow

**Utilities:**
- [ ] Fn::GetEnv, Fn::Eval
- [ ] Fn::Filenames, Fn::Sequence
- [ ] Fn::Length, Fn::Map, Fn::IfEval

## Phase 3: Testing & Documentation (Week 2)

- [ ] Unit tests for all functions
- [ ] Integration tests
- [ ] API documentation
- [ ] Usage examples
- [ ] Migration guide (from cfn-include)

## Phase 4: Publishing (Week 2)

- [ ] npm publish (@brickhouse-tech/yaml-include)
- [ ] GitHub release with changelog
- [ ] Update cfn-include to depend on it
- [ ] Announce on Twitter, Reddit, dev.to

## Future Enhancements

- [ ] Plugin system for custom functions
- [ ] CLI tool improvements
- [ ] Performance optimizations
- [ ] Watch mode for file changes
- [ ] VS Code extension?

## Files to Extract from cfn-include

```
cfn-include/src/lib/
├── yaml.ts                  → yaml-include/src/lib/yaml.ts
├── request.ts               → yaml-include/src/lib/request.ts
├── replaceEnv.ts            → yaml-include/src/lib/replaceEnv.ts
├── scope.ts                 → yaml-include/src/lib/scope.ts
├── cache.ts                 → yaml-include/src/lib/cache.ts
├── promise-utils.ts         → yaml-include/src/lib/promise-utils.ts
├── utils.ts                 → yaml-include/src/lib/utils.ts
├── parselocation.ts         → yaml-include/src/lib/parselocation.ts
├── include/query.ts         → yaml-include/src/lib/include/query.ts
└── functions/
    ├── registry.ts          → yaml-include/src/lib/functions/registry.ts (filtered)
    ├── types.ts             → yaml-include/src/lib/functions/types.ts
    ├── helpers.ts           → yaml-include/src/lib/functions/helpers.ts
    ├── fn-include.ts        → yaml-include/src/lib/functions/fn-include.ts (sans S3)
    ├── fn-array-ops.ts      → yaml-include/src/lib/functions/fn-array-ops.ts
    ├── fn-object-ops.ts     → yaml-include/src/lib/functions/fn-object-ops.ts
    ├── fn-string-ops.ts     → yaml-include/src/lib/functions/fn-string-ops.ts
    ├── fn-length.ts         → yaml-include/src/lib/functions/fn-length.ts
    ├── fn-map.ts            → yaml-include/src/lib/functions/fn-map.ts
    └── fn-misc.ts           → yaml-include/src/lib/functions/fn-misc.ts (partial)
```

## Excluded (stays in cfn-include)

- S3 support (AWS SDK dependency)
- Fn::Outputs, Fn::RefNow, Fn::ApplyTags (CFN-specific)
- cfnclient.ts (AWS CLI integration)
- analysis.ts, clustering.ts, graph.ts (Phase 4.2 features)
- suggestions.ts (CFN validation)
