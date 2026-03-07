import { describe, it, expect } from 'vitest';
import path from 'node:path';
import include from '../src/index.js';
import { load, dump } from '../src/lib/yaml.js';
import parseLocation from '../src/lib/parselocation.js';
import replaceEnv from '../src/lib/replaceEnv.js';
import { createChildScope } from '../src/lib/scope.js';
import { upperCamelCase, lowerCamelCase } from '../src/lib/utils.js';
import { isOurExplicitFunction } from '../src/lib/schema.js';

const fixturesDir = path.resolve(import.meta.dirname, 'fixtures');

// --- YAML/JSON parsing ---

describe('yaml.ts', () => {
  it('parses YAML', () => {
    const result = load('foo: bar\nbaz: 1');
    expect(result).toEqual({ foo: 'bar', baz: 1 });
  });

  it('parses JSON', () => {
    const result = load('{"foo": "bar"}');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('parses JSON with comments', () => {
    const result = load('{\n// comment\n"foo": "bar"\n}');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('dumps YAML', () => {
    const result = dump({ b: 2, a: 1 });
    expect(result).toContain('a: 1');
    expect(result).toContain('b: 2');
  });

  it('parses YAML with custom tags', () => {
    const result = load('!Include ./file.yaml') as Record<string, unknown>;
    expect(result).toEqual({ 'Fn::Include': './file.yaml' });
  });
});

// --- parseLocation ---

describe('parselocation.ts', () => {
  it('parses file:// URLs', () => {
    const loc = parseLocation('file:///tmp/test.yaml');
    expect(loc.protocol).toBe('file');
    expect(loc.relative).toBe(false);
  });

  it('parses https:// URLs', () => {
    const loc = parseLocation('https://example.com/template.yaml');
    expect(loc.protocol).toBe('https');
    expect(loc.host).toBe('example.com');
  });

  it('parses relative paths', () => {
    const loc = parseLocation('./relative/path.yaml');
    expect(loc.relative).toBe(true);
  });

  it('handles null/undefined', () => {
    const loc = parseLocation(null);
    expect(loc.relative).toBe(true);
  });
});

// --- replaceEnv ---

describe('replaceEnv.ts', () => {
  it('replaces $VAR syntax', () => {
    const result = replaceEnv('hello $name', { name: 'world' });
    expect(result).toBe('hello world');
  });

  it('replaces ${VAR} syntax', () => {
    const result = replaceEnv('hello ${name}', { name: 'world' });
    expect(result).toBe('hello world');
  });

  it('passes non-strings through', () => {
    expect(replaceEnv(42)).toBe(42);
    expect(replaceEnv(null)).toBe(null);
  });

  it('IsRegExVar detects variables', () => {
    expect(replaceEnv.IsRegExVar('$FOO')).toBe(true);
    expect(replaceEnv.IsRegExVar('${FOO}')).toBe(true);
    expect(replaceEnv.IsRegExVar('no vars')).toBe(false);
  });
});

// --- scope ---

describe('scope.ts', () => {
  it('creates child scope inheriting from parent', () => {
    const parent = { a: 1 };
    const child = createChildScope(parent, { b: 2 });
    expect(child.a).toBe(1);
    expect(child.b).toBe(2);
  });

  it('child does not modify parent', () => {
    const parent = { a: 1 };
    const child = createChildScope(parent, { a: 99 });
    expect(child.a).toBe(99);
    expect(parent.a).toBe(1);
  });
});

// --- utils ---

describe('utils.ts', () => {
  it('upperCamelCase', () => {
    expect(upperCamelCase('hello-world')).toBe('HelloWorld');
    expect(upperCamelCase('foo_bar')).toBe('FooBar');
  });

  it('lowerCamelCase', () => {
    expect(lowerCamelCase('hello-world')).toBe('helloWorld');
    expect(lowerCamelCase('Foo_bar')).toBe('fooBar');
  });
});

// --- schema ---

describe('schema.ts', () => {
  it('isOurExplicitFunction recognizes Fn:: functions', () => {
    expect(isOurExplicitFunction('Fn::Include')).toBe(true);
    expect(isOurExplicitFunction('Fn::Merge')).toBe(true);
    expect(isOurExplicitFunction('Fn::DeepMerge')).toBe(true);
  });

  it('rejects non-Fn:: keys', () => {
    expect(isOurExplicitFunction('Resources')).toBe(false);
    expect(isOurExplicitFunction('Type')).toBe(false);
  });
});

// --- include() integration ---

describe('include()', () => {
  it('loads and processes a simple YAML file', async () => {
    const result = await include({
      url: `file://${fixturesDir}/simple.yaml`,
    });
    expect(result).toEqual({ greeting: 'hello', name: 'world' });
  });

  it('processes Fn::Include', async () => {
    const result = await include({
      url: `file://${fixturesDir}/with-include.yaml`,
    });
    expect(result.base).toEqual({ greeting: 'hello', name: 'world' });
    expect(result.extra).toBe('data');
  });

  it('processes Fn::Merge', async () => {
    const result = await include({
      url: `file://${fixturesDir}/with-merge.yaml`,
    });
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('processes templates with variable injection', async () => {
    const result = await include({
      url: `file://${fixturesDir}/with-vars.yaml`,
      inject: { name: 'Nick', place: 'Earth' },
    });
    expect(result.message).toBe('Hello Nick from Earth');
  });

  it('processes in-memory templates', async () => {
    const result = await include({
      url: 'file:///dummy',
      template: { 'Fn::Flatten': [[1, 2], [3, 4]] },
    });
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('rejects relative URLs', async () => {
    await expect(include({ url: './relative' })).rejects.toThrow('url cannot be relative');
  });
});
