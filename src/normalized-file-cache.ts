import { normalizeFile } from "./normalize-file";
import { FilePath } from "./types";

export class NormalizedFileCache {
  constructor(private cache = new Map<FilePath, string[]>()){}
  async get(key: FilePath) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const f = await normalizeFile(key);
    this.cache.set(key, f);
    return f;
  }
}
