import type { ConfigPath } from './types';

const cloneShallow = <T>(target: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(target);
  }
  return JSON.parse(JSON.stringify(target));
};

const normalizePath = (path?: ConfigPath | string): ConfigPath | undefined => {
  if (!path || (Array.isArray(path) && path.length === 0)) return undefined;
  if (typeof path === 'string') return path.split('/') as unknown as ConfigPath;
  return path;
};

export const getValueAtPath = <T = unknown>(root: any, path?: ConfigPath | string, fallback?: T): T | undefined => {
  const normalized = normalizePath(path);
  if (!normalized || normalized.length === 0) return fallback;
  let current = root;
  for (const key of normalized) {
    if (current === undefined || current === null) return fallback;
    current = current[key as any];
  }
  return (current as T) ?? fallback;
};

export const setValueAtPath = <T extends Record<string, any>>(root: T, path: ConfigPath | string, value: any): T => {
  const normalized = normalizePath(path);
  if (!normalized || normalized.length === 0) return root;
  const cloned = cloneShallow(root);
  let cursor: any = cloned;

  normalized.forEach((key, index) => {
    const isLast = index === normalized.length - 1;
    if (isLast) {
      cursor[key as any] = value;
      return;
    }
    if (cursor[key as any] === undefined) {
      // Create intermediate containers based on the next key type.
      cursor[key as any] = typeof normalized[index + 1] === 'number' ? [] : {};
    }
    cursor = cursor[key as any];
  });

  return cloned;
};

export const pathToArray = (path: ConfigPath | string): ConfigPath => normalizePath(path) ?? [];
