import { describe, it, expect } from 'vitest';
import include from '../src/index.js';
import { buildRegistry } from '../src/lib/functions/registry.js';

const DUMMY_URL = 'file:///dummy';

function run(template: unknown) {
  return include({ url: DUMMY_URL, template });
}

describe('Array operations', () => {
  it('Fn::Flatten', async () => {
    expect(await run({ 'Fn::Flatten': [[1, 2], [3, 4]] })).toEqual([1, 2, 3, 4]);
  });

  it('Fn::FlattenDeep', async () => {
    expect(await run({ 'Fn::FlattenDeep': [[[1]], [[2, [3]]]] })).toEqual([1, 2, 3]);
  });

  it('Fn::Uniq', async () => {
    expect(await run({ 'Fn::Uniq': [1, 2, 2, 3, 3] })).toEqual([1, 2, 3]);
  });

  it('Fn::Compact', async () => {
    expect(await run({ 'Fn::Compact': [0, 1, false, 2, '', 3, null] })).toEqual([1, 2, 3]);
  });

  it('Fn::Sort', async () => {
    expect(await run({ 'Fn::Sort': ['c', 'a', 'b'] })).toEqual(['a', 'b', 'c']);
  });

  it('Fn::SortedUniq', async () => {
    expect(await run({ 'Fn::SortedUniq': [3, 1, 2, 1, 3] })).toEqual([1, 2, 3]);
  });

  it('Fn::Without', async () => {
    expect(await run({ 'Fn::Without': [[1, 2, 3, 4], [2, 4]] })).toEqual([1, 3]);
  });

  it('Fn::Concat', async () => {
    expect(await run({ 'Fn::Concat': [[1, 2], [3, 4]] })).toEqual([1, 2, 3, 4]);
  });

  it('Fn::Length', async () => {
    expect(await run({ 'Fn::Length': [1, 2, 3] })).toBe(3);
  });

  it('Fn::Sequence (numbers)', async () => {
    expect(await run({ 'Fn::Sequence': [1, 5] })).toEqual([1, 2, 3, 4, 5]);
  });

  it('Fn::Sequence (letters)', async () => {
    expect(await run({ 'Fn::Sequence': ['a', 'e'] })).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('Object operations', () => {
  it('Fn::Merge', async () => {
    const result = await run({ 'Fn::Merge': [{ a: 1 }, { b: 2 }] });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('Fn::DeepMerge', async () => {
    const result = await run({
      'Fn::DeepMerge': [
        { a: { x: 1 } },
        { a: { y: 2 } },
      ],
    });
    expect(result).toEqual({ a: { x: 1, y: 2 } });
  });

  it('Fn::ObjectKeys', async () => {
    expect(await run({ 'Fn::ObjectKeys': { a: 1, b: 2 } })).toEqual(['a', 'b']);
  });

  it('Fn::ObjectValues', async () => {
    expect(await run({ 'Fn::ObjectValues': { a: 1, b: 2 } })).toEqual([1, 2]);
  });

  it('Fn::Omit (array form)', async () => {
    const result = await run({ 'Fn::Omit': [{ a: 1, b: 2, c: 3 }, ['b']] });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('Fn::OmitEmpty', async () => {
    const result = await run({ 'Fn::OmitEmpty': { a: 1, b: null, c: '', d: 0 } });
    expect(result).toEqual({ a: 1, d: 0 });
  });
});

describe('String operations', () => {
  it('Fn::Stringify', async () => {
    expect(await run({ 'Fn::Stringify': { a: 1 } })).toBe('{"a":1}');
  });

  it('Fn::UpperCamelCase', async () => {
    expect(await run({ 'Fn::UpperCamelCase': 'hello-world' })).toBe('HelloWorld');
  });

  it('Fn::LowerCamelCase', async () => {
    expect(await run({ 'Fn::LowerCamelCase': 'hello-world' })).toBe('helloWorld');
  });
});

describe('Utility functions', () => {
  it('Fn::GetEnv returns env var', async () => {
    globalThis.process.env.TEST_YAML_INCLUDE = 'test_value';
    expect(await run({ 'Fn::GetEnv': ['TEST_YAML_INCLUDE', 'default'] })).toBe('test_value');
    delete globalThis.process.env.TEST_YAML_INCLUDE;
  });

  it('Fn::GetEnv returns default when missing', async () => {
    expect(await run({ 'Fn::GetEnv': ['NONEXISTENT_VAR_12345', 'fallback'] })).toBe('fallback');
  });

  it('Fn::Map iterates', async () => {
    const result = await run({
      'Fn::Map': [
        ['a', 'b', 'c'],
        'item',
        { value: 'item' },
      ],
    });
    expect(result).toEqual([{ value: 'a' }, { value: 'b' }, { value: 'c' }]);
  });
});

describe('No AWS/CFN leakage', () => {
  it('registry does not contain Fn::Outputs', () => {
    const registry = buildRegistry(async () => null);
    expect(registry.handlers['Fn::Outputs']).toBeUndefined();
  });

  it('registry does not contain Fn::RefNow', () => {
    const registry = buildRegistry(async () => null);
    expect(registry.handlers['Fn::RefNow']).toBeUndefined();
  });

  it('registry does not contain Fn::ApplyTags', () => {
    const registry = buildRegistry(async () => null);
    expect(registry.handlers['Fn::ApplyTags']).toBeUndefined();
  });

  it('registry contains all expected generic functions', () => {
    const registry = buildRegistry(async () => null);
    const expected = [
      'Fn::Include', 'Fn::Map', 'Fn::Length',
      'Fn::Flatten', 'Fn::FlattenDeep', 'Fn::Uniq', 'Fn::Compact',
      'Fn::Concat', 'Fn::Sort', 'Fn::SortedUniq', 'Fn::SortBy', 'Fn::Without',
      'Fn::Omit', 'Fn::OmitEmpty', 'Fn::Merge', 'Fn::DeepMerge',
      'Fn::ObjectKeys', 'Fn::ObjectValues', 'Fn::SortObject',
      'Fn::Stringify', 'Fn::StringSplit',
      'Fn::UpperCamelCase', 'Fn::LowerCamelCase',
      'Fn::GetEnv', 'Fn::Eval', 'Fn::Filenames', 'Fn::Sequence',
      'Fn::IfEval', 'Fn::JoinNow', 'Fn::SubNow',
    ];
    for (const fn of expected) {
      expect(registry.handlers[fn], `${fn} should be registered`).toBeDefined();
    }
  });
});
