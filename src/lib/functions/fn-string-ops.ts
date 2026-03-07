import { lowerCamelCase, upperCamelCase } from '../utils.js';
import type { RecurseContext, RecurseFn, TemplateObject } from './types.js';

export function createFnStringify(recurse: RecurseFn) {
  return async (ctx: RecurseContext): Promise<any> => {
    const { base, scope, cft, rootTemplate, ...opts } = ctx;
    const obj = cft as TemplateObject;
    const json = await recurse({ base, scope, cft: obj['Fn::Stringify'], rootTemplate, caller: 'Fn::Stringify', ...opts });
    return JSON.stringify(json);
  };
}

export function createFnStringSplit(recurse: RecurseFn) {
  return async (ctx: RecurseContext): Promise<any> => {
    const { base, scope, cft, rootTemplate, ...opts } = ctx;
    const obj = cft as TemplateObject;
    const { string = '', separator = ',', doLog } = await recurse({ base, scope, cft: obj['Fn::StringSplit'], rootTemplate, caller: 'Fn::StringSplit', ...opts }) as { string?: string; separator?: string; doLog?: boolean };
    if (doLog) console.log({ string, separator });
    return string.split(separator);
  };
}

export function createFnUpperCamelCase() {
  return async (ctx: RecurseContext): Promise<any> => {
    const obj = ctx.cft as TemplateObject;
    return upperCamelCase(obj['Fn::UpperCamelCase'] as string);
  };
}

export function createFnLowerCamelCase() {
  return async (ctx: RecurseContext): Promise<any> => {
    const obj = ctx.cft as TemplateObject;
    return lowerCamelCase(obj['Fn::LowerCamelCase'] as string);
  };
}
