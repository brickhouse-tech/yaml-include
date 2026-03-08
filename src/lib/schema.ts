import yaml from 'js-yaml';
import _ from 'lodash';

interface TagDefinition {
  short: string;
  full: string;
  type: 'scalar' | 'mapping' | 'sequence';
}

const tagDefinitions: TagDefinition[] = [
  // Core
  { short: 'Include', full: 'Fn::Include', type: 'scalar' },
  { short: 'Include', full: 'Fn::Include', type: 'mapping' },

  // String operations
  { short: 'Stringify', full: 'Fn::Stringify', type: 'sequence' },
  { short: 'Stringify', full: 'Fn::Stringify', type: 'mapping' },
  { short: 'LowerCamelCase', full: 'Fn::LowerCamelCase', type: 'scalar' },
  { short: 'UpperCamelCase', full: 'Fn::UpperCamelCase', type: 'scalar' },
  { short: 'JoinNow', full: 'Fn::JoinNow', type: 'scalar' },
  { short: 'SubNow', full: 'Fn::SubNow', type: 'scalar' },
  { short: 'SubNow', full: 'Fn::SubNow', type: 'sequence' },

  // Array operations
  { short: 'Map', full: 'Fn::Map', type: 'sequence' },
  { short: 'Length', full: 'Fn::Length', type: 'sequence' },
  { short: 'Flatten', full: 'Fn::Flatten', type: 'sequence' },
  { short: 'FlattenDeep', full: 'Fn::FlattenDeep', type: 'sequence' },
  { short: 'Uniq', full: 'Fn::Uniq', type: 'sequence' },
  { short: 'Compact', full: 'Fn::Compact', type: 'sequence' },
  { short: 'Concat', full: 'Fn::Concat', type: 'sequence' },
  { short: 'Sort', full: 'Fn::Sort', type: 'sequence' },
  { short: 'SortedUniq', full: 'Fn::SortedUniq', type: 'sequence' },
  { short: 'SortBy', full: 'Fn::SortBy', type: 'mapping' },
  { short: 'Without', full: 'Fn::Without', type: 'sequence' },
  { short: 'Sequence', full: 'Fn::Sequence', type: 'sequence' },

  // Object operations
  { short: 'Merge', full: 'Fn::Merge', type: 'sequence' },
  { short: 'DeepMerge', full: 'Fn::DeepMerge', type: 'sequence' },
  { short: 'SortObject', full: 'Fn::SortObject', type: 'mapping' },
  { short: 'ObjectKeys', full: 'Fn::ObjectKeys', type: 'sequence' },
  { short: 'ObjectValues', full: 'Fn::ObjectValues', type: 'sequence' },
  { short: 'Omit', full: 'Fn::Omit', type: 'sequence' },
  { short: 'Omit', full: 'Fn::Omit', type: 'mapping' },
  { short: 'OmitEmpty', full: 'Fn::OmitEmpty', type: 'mapping' },
  { short: 'Filenames', full: 'Fn::Filenames', type: 'sequence' },

  // Utilities
  { short: 'GetEnv', full: 'Fn::GetEnv', type: 'sequence' },
  { short: 'GetEnv', full: 'Fn::GetEnv', type: 'scalar' },
  { short: 'Eval', full: 'Fn::Eval', type: 'sequence' },
  { short: 'IfEval', full: 'Fn::IfEval', type: 'mapping' },
];

const tags = tagDefinitions.map((fn) => {
  return new yaml.Type('!' + fn.short, {
    kind: fn.type,
    construct: function (obj: unknown): Record<string, unknown> {
      return _.fromPairs([[fn.full, obj]]);
    },
  });
});

const yamlSchema = yaml.DEFAULT_SCHEMA.extend(tags);

/**
 * Test a function key to determine if it's one of our custom functions.
 * Returns true for any "Fn::*" key (all are ours in the generic engine).
 */
export function isOurExplicitFunction(testKeyForFunc: string): boolean {
  return /^Fn::/.test(testKeyForFunc);
}

export default yamlSchema;
