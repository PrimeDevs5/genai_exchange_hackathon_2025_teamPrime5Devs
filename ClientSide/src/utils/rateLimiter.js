/**
 * Simple rate limiter for API calls
 */
class RateLimiter {
  constructor(minDelay = 1000) {
    this.minDelay = minDelay;
    this.lastCallTime = 0;
  }

  async throttle() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minDelay) {
      const delayNeeded = this.minDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }
    
    this.lastCallTime = Date.now();
  }
}

// Global instance for translation API
export const translationRateLimiter = new RateLimiter(1500); // 1.5 seconds between calls