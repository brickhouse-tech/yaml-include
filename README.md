# yaml-include

> Generic YAML/JSON preprocessor with includes, merging, and transformations

**Core engine for [cfn-include](https://github.com/brickhouse-tech/cfn-include)** — extract the power of modular YAML processing for any use case.

## Features

- **File Inclusion** — HTTP, local files, glob patterns
- **Template Variables** — Environment variable substitution
- **Powerful Transforms** — 30+ built-in functions for arrays, objects, strings
- **JSON & YAML** — Seamless conversion between formats
- **Recursive Processing** — Nested includes with scope management
- **Zero AWS Dependencies** — Use with Kubernetes, Docker Compose, Ansible, etc.

## Installation

```bash
npm install @brickhouse-tech/yaml-include
```

## Quick Start

```javascript
import { include } from '@brickhouse-tech/yaml-include';

const result = await include({
  url: './template.yaml',
  doEnv: true
});

console.log(result);
```

**Example `template.yaml`:**
```yaml
config:
  Fn::Include: ./base-config.yaml
database:
  host: ${DB_HOST}
  Fn::Merge:
    - Fn::Include: ./db-defaults.yaml
    - port: 5432
```

## Use Cases

- **Kubernetes Manifests** — Modular, reusable configs
- **Docker Compose** — Share service definitions
- **GitHub Actions** — Reusable workflow templates
- **Ansible Playbooks** — Organize complex deployments
- **CloudFormation** — See [cfn-include](https://github.com/brickhouse-tech/cfn-include)

## Built-in Functions

### Array Operations
- `Fn::Flatten`, `Fn::FlattenDeep`, `Fn::Uniq`, `Fn::Compact`
- `Fn::Concat`, `Fn::Sort`, `Fn::SortedUniq`, `Fn::Without`

### Object Operations
- `Fn::Merge`, `Fn::DeepMerge`, `Fn::Omit`, `Fn::OmitEmpty`
- `Fn::ObjectKeys`, `Fn::ObjectValues`, `Fn::SortObject`

### String Operations
- `Fn::Stringify`, `Fn::StringSplit`
- `Fn::UpperCamelCase`, `Fn::LowerCamelCase`
- `Fn::JoinNow`, `Fn::SubNow`

### Utilities
- `Fn::GetEnv`, `Fn::Eval`, `Fn::Filenames`
- `Fn::Length`, `Fn::Map`, `Fn::Sequence`, `Fn::IfEval`

## Documentation

[Full documentation →](https://github.com/brickhouse-tech/yaml-include/blob/main/docs/README.md)

## CloudFormation Users

Looking for AWS-specific features (S3, Fn::Outputs, RefNow)?  
👉 Check out [cfn-include](https://github.com/brickhouse-tech/cfn-include)

## License

MIT © [Nick McCready](https://github.com/nmccready)

## Related Projects

- [cfn-include](https://github.com/brickhouse-tech/cfn-include) — CloudFormation preprocessor
- [angular-lts](https://github.com/brickhouse-tech/angular.js) — Security patches for AngularJS 1.x
- [json-schema-lts](https://github.com/brickhouse-tech/json-schema) — Security patches for json-schema

---

**Brickhouse-Tech** — Open source security & infrastructure tools  
[GitHub Sponsors](https://github.com/sponsors/brickhouse-tech) • [More Projects](https://github.com/brickhouse-tech)
