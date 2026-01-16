class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 600000) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });

    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
  clearPattern(pattern) {
    const regex = new RegExp(pattern.replace("*", ".*"));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    return this.cache.size;
  }
}

const cache = new Cache();

module.exports = cache;
