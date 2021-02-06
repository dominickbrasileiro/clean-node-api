export interface HashComparer {
  compare(value: string, hashToCompare: string): Promise<boolean>;
}
