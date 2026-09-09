import { hash, verify } from '@node-rs/argon2';
// 2 is Argon2id in the native binding. Avoid importing its ambient const enum.
export const hashPassword = (password: string) => hash(password, { algorithm: 2 as never, memoryCost: 19456, timeCost: 2, parallelism: 1 });
export const verifyPassword = (digest: string, password: string) => verify(digest, password);
