const CACHE_PREFIX = 'elimu_cache_';
const DEFAULT_TTL = 3600; // 1 hour in seconds

const cacheService = {
  /**
   * Set data in cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   */
  set(key, data, ttl = DEFAULT_TTL) {
    const item = {
      data,
      expiry: Date.now() + (ttl * 1000),
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  },

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {any} Cached data or null if expired/missing
   */
  get(key) {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  },

  /**
   * Remove specific item from cache
   * @param {string} key - Cache key
   */
  remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  /**
   * Clear all cached items
   */
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },

  /**
   * Get item with automatic refetch if expired
   * @param {string} key - Cache key
   * @param {function} fetchFn - Function to fetch fresh data
   * @param {number} ttl - Time to live in seconds
   */
  async getOrFetch(key, fetchFn, ttl = DEFAULT_TTL) {
    const cached = this.get(key);
    if (cached) return cached;

    const fresh = await fetchFn();
    this.set(key, fresh, ttl);
    return fresh;
  }
};

export default cacheService;
