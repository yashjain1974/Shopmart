import axios from 'axios';
import { Platform } from 'react-native';
import { API_URL } from '@env';

class AnalyticsService {
  static async trackEngagement(contentId, action, metadata = {}) {
    try {
      const payload = {
        content_id: contentId || 'unknown',
        action: action,
        timestamp: new Date().toISOString(),
        user_id: 'anonymous',
        metadata: metadata
      };

      const response = await axios.post(`${API_URL}/analytics/engagement/`, payload);
      return response.data;
    } catch (error) {
      console.error('Analytics Error:', error);
    }
  }

  static async getContentAnalytics(contentId, days = 7) {
    try {
      const response = await axios.get(`${API_URL}/analytics/content/${contentId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Analytics Error:', error);
      return null;
    }
  }

  static async getUserAnalytics(userId, days = 7) {
    try {
      const response = await axios.get(`${API_URL}/analytics/user/${userId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Analytics Error:', error);
      return null;
    }
  }
}

export default AnalyticsService; 