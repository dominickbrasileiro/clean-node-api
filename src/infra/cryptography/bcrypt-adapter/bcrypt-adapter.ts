import bcrypt from 'bcrypt';
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer';
import { Hasher } from '../../../data/protocols/criptography/hasher';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hashToCompare: string): Promise<boolean> {
    return bcrypt.compare(value, hashToCompare);
  }
}
