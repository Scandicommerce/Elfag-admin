import { supabase } from './supabase';

export type RecentActivityData = {
  datetime: string;
  action: string;
  category: string;
  region: string;
  status: 'active' | 'pending' | 'completed' | 'rejected';
};

export type CategoryPerformanceData = {
  name: string;
  totalListings: number;
  active: number;
  completed: number;
  successRate: number;
};

/**
 * Get category performance data
 * - ADMIN VIEW: Shows ALL resources from ALL users
 */
export const getCategoryPerformance = async (): Promise<CategoryPerformanceData[]> => {
  try {
    // Get ALL resources from ALL users (admin view)
    const { data: resourcesData, error: resourcesError } = await supabase
      .from('resources')
      .select('id, is_special, is_taken');
    
    if (resourcesError) {
      console.error('Error fetching resources for category performance:', resourcesError);
      return [];
    }
    
    // Get ALL messages from ALL users (admin view)
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('resource_id, read_at');
    if (messagesError) {
      console.error('Error fetching messages for category performance:', messagesError);
      return [];
    }
    // Calculate stats for each category
    const categories = ['Available Staff', 'Special Tools'];
    const performance: CategoryPerformanceData[] = [];
    
    for (const categoryName of categories) {
      const isSpecialTools = categoryName === 'Special Tools';
      const categoryResources = resourcesData?.filter(r => r.is_special === isSpecialTools) || [];
      
      
      const totalListings = categoryResources.length;
      let completed = 0;
      let active = 0;
      
      for (const resource of categoryResources) {
        const relatedMessages = messagesData?.filter(m => m.resource_id === resource.id) || [];
        
        // Check if this resource is completed
        const hasReadMessages = relatedMessages.some(m => m.read_at !== null);
        const isCompleted = resource.is_taken && hasReadMessages;
   
        if (isCompleted) {
          completed++;
        } else {
          active++;
        }
      }
      
      const successRate = totalListings > 0 ? Math.round((completed / totalListings) * 100) : 0;
      
      performance.push({
        name: categoryName,
        totalListings,
        active,
        completed,
        successRate
      });
    }
    
    return performance;
  } catch (error) {
    console.error('Error in getCategoryPerformance:', error);
    return [];
  }
};

/**
 * Get recent system activity data from the last month
 * - ADMIN VIEW: Shows ALL activity from ALL users
 */
export const getRecentActivity = async (): Promise<RecentActivityData[]> => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Get ALL resources data from ALL users (admin view)
    const { data: resourcesData, error: resourcesError } = await supabase
      .from('resources')
      .select('id, created_at, is_taken, is_special, location')
      .gte('created_at', oneMonthAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError);
      return [];
    }
    
    // Get ALL messages data from ALL users (admin view)
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('resource_id, created_at, read_at')
      .gte('created_at', oneMonthAgo.toISOString())
      .order('created_at', { ascending: false });
    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return [];
    }
    
    const activities: RecentActivityData[] = [];
    
    // Process ALL resources from ALL users
    if (resourcesData) {
      for (const resource of resourcesData) {
        const relatedMessages = messagesData?.filter(msg => msg.resource_id === resource.id) || [];
        
        if (relatedMessages.length === 0) {
          // No messages for this resource - it's a created listing
          activities.push({
            datetime: new Date(resource.created_at).toLocaleString(),
            action: 'Created listing',
            category: resource.is_special ? 'Special Tools' : 'Available Staff',
            region: resource.location || '-',
            status: 'active'
          });
        } else {
          // Has messages - process each message
          for (const message of relatedMessages) {
            if (resource.is_taken && message.read_at !== null) {
              // is_taken=true, read_at≠null: COMPLETED
              activities.push({
                datetime: new Date(message.created_at).toLocaleString(),
                action: 'Accepted match',
                category: resource.is_special ? 'Special Tools' : 'Available Staff',
                region: resource.location || '-',
                status: 'completed'
              });
            } else if (resource.is_taken && message.read_at === null) {
              // is_taken=true, read_at=null: Showed interest, Pending
              activities.push({
                datetime: new Date(message.created_at).toLocaleString(),
                action: 'Showed interest',
                category: resource.is_special ? 'Special Tools' : 'Available Staff',
                region: resource.location || '-',
                status: 'pending'
              });
            } else if (!resource.is_taken && message.read_at !== null) {
              // is_taken=false, read_at≠null: Rejected interest, Rejected
              activities.push({
                datetime: new Date(message.created_at).toLocaleString(),
                action: 'Rejected interest',
                category: resource.is_special ? 'Special Tools' : 'Available Staff',
                region: resource.location || '-',
                status: 'rejected'
              });
            }
          }
        }
      }
    }
    
    // Sort by datetime (most recent first)
    activities.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    
    return activities.slice(0, 20); // Return last 20 activities from ALL users
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    return [];
  }
}; 