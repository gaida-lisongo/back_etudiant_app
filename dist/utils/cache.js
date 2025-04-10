import { cache } from '../utils/cache';

// In your controller method
async cours(req: Request, res: Response) {
  try {
    const { promotionId } = req.params;
    if (!promotionId) {
      return this.badRequest(res, 'Promotion ID is required');
    }
    
    // Create a cache key
    const cacheKey = `courses:${promotionId}`;
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return this.success(res, cachedData, 'Courses retrieved from cache');
    }
    
    // If not in cache, get from database
    const result = await this.promotionModel.getCourses(parseInt(promotionId, 10));
    
    // Store in cache for future requests
    if (result.status === 'success') {
      await cache.set(cacheKey, result.data);
    }
    
    return this.success(res, result.data, 'Courses retrieved successfully');
  } catch (error) {
    return this.serverError(res, error);
  }
}