/**
 * Checks if content was recently updated based on a last updated date
 * @param {string} lastUpdated - The date the content was last updated
 * @param {number} daysThreshold - Number of days to consider content as "recently" updated (default: 10)
 * @returns {boolean} - True if content was updated within threshold, false otherwise
 */

export function isRecentlyUpdated(lastUpdated, daysThreshold = 10) {
  try {
    if (lastUpdated) {
      const currentDate = new Date();
      const updateDate = new Date(lastUpdated);
      
      // Check if we have a valid date
      if (!isNaN(updateDate.getTime())) {
        const daysSinceUpdate = Math.abs((currentDate - updateDate) / (1000 * 60 * 60 * 24));
        return daysSinceUpdate <= daysThreshold;
      }
    }
    return false;
  } catch (error) {
    console.error('Error parsing date:', error);
    return false;
  }
}
