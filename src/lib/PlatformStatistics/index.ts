import { supabase } from '../supabase';

export type PlatformStatisticsData = {
  totalListings: number;
  successfulMatches: number;
  pendingConnections: number;
  activeListings: number;
  totalInterests: number;
  isUsingSampleData?: boolean;
};

// Fallback sample data for when database is not set up yet
const SAMPLE_PLATFORM_STATS: PlatformStatisticsData = {
  totalListings: 5,
  successfulMatches: 2,
  pendingConnections: 2,
  activeListings: 3,
  totalInterests: 5,
  isUsingSampleData: true
};

/**
 * Check if database tables exist
 */
const checkTablesExist = async (): Promise<boolean> => {
  try {
    // Try a simple query to check if tables exist
    const { error } = await supabase
      .from('resources')
      .select('id', { count: 'exact', head: true });
    
    return !error;
  } catch (error) {
    return false;
  }
};

/**
 * Check different possible table names
 */
export const checkTableNames = async () => {
  const possibleNames = ['messages', 'message', 'Messages', 'Message'];
  
  for (const tableName of possibleNames) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        return tableName;
      } else {
        console.log(`❌ Table "${tableName}" not found:`, error.message);
      }
    } catch (err) {
      console.log(`❌ Error checking "${tableName}":`, err);
    }
  }
  
  return null;
};

/**
 * Get Total Listings = resources table of all count
 */
export const getTotalListings = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching total listings:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalListings:', error);
    return 0;
  }
};

/**
 * Get All Messages Table Data
 */
export const getAllMessages = async () => {
  try {
    const foundTableName = await checkTableNames();
    if (!foundTableName) {
      console.error('❌ NO MESSAGES TABLE FOUND with any common name');
      return [];
    }
    
    const { count, error: countError } = await supabase
      .from(foundTableName)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error details:', {
        message: countError.message,
        details: countError.details,
        hint: countError.hint,
        code: countError.code
      });
    } else {
      console.log(`${foundTableName} count:`, count);
    }
    
    const { data, error } = await supabase
      .from(foundTableName)
      .select('*')
      .not('read_at', 'is', null);
    
    if (error) {
      console.error('DATA FETCH ERROR:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Check if it's a table not found error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error(`❌ TABLE NOT FOUND: The "${foundTableName}" table does not exist in your database`);
      }
      
      // Check if it's a permission error
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.error('❌ PERMISSION DENIED: Check your Row Level Security (RLS) policies');
      }
      
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR in getAllMessages:', error);
    return [];
  }
};

/**
 * Get Successful Matches = JOIN messages and resources where:
 * messages.resource_id == resources.id && accepted_by_company_id !== NULL && is_taken === true
 */
export const getSuccessfulMatches = async (): Promise<number> => {
  try {
    // Get all messages table data first
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        resources!inner (
          id,
          accepted_by_company_id,
          is_taken
        )
      `)
      .not('read_at', 'is', null)
      .eq('resources.is_taken', true)
      .not('resources.accepted_by_company_id', 'is', null);
    
    if (error) {
      console.error('Error fetching successful matches:', error);
      return 0;
    }
    
    return data?.length || 0;
  } catch (error) {
    console.error('Error in getSuccessfulMatches:', error);
    return 0;
  }
};

/**
 * Get Pending Connections = messages table where read_at field is null (empty)
 */
export const getPendingConnections = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .is('read_at', null);
    
    if (error) {
      console.error('Error fetching pending connections:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getPendingConnections:', error);
    return 0;
  }
};

/**
 * Get Total Interests = all count of messages table
 */
export const getTotalInterests = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching total interests:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalInterests:', error);
    return 0;
  }
};

/**
 * Get all platform statistics data
 * Active Listings = Total Listings - Successful Matches
 */
export const getAllPlatformStatistics = async (): Promise<PlatformStatisticsData> => {
  try {
    // Check if database tables exist
    const tablesExist = await checkTablesExist();
    
    if (!tablesExist) {
      console.warn('Database tables not found. Using sample data. Please run the database setup script.');
      return SAMPLE_PLATFORM_STATS;
    }
    
    // Execute all queries in parallel for better performance
    const [
      totalListings,
      successfulMatches,
      pendingConnections,
      totalInterests
    ] = await Promise.all([
      getTotalListings(),
      getSuccessfulMatches(),
      getPendingConnections(),
      getTotalInterests()
    ]);
    
    // Calculate Active Listings = Total Listings - Successful Matches
    const activeListings = totalListings - successfulMatches;
    
    return {
      totalListings,
      successfulMatches,
      pendingConnections,
      activeListings: Math.max(0, activeListings), // Ensure non-negative
      totalInterests,
      isUsingSampleData: false
    };
  } catch (error) {
    console.error('Error in getAllPlatformStatistics:', error);
    
    // Return sample data as fallback
    console.warn('Using sample data due to database error. Please check your database setup.');
    return SAMPLE_PLATFORM_STATS;
  }
}; 