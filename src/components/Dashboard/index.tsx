import { useState, useEffect } from 'react';
import { getRecentActivity, getCategoryPerformance, type RecentActivityData, type CategoryPerformanceData } from '../../lib/statistics';
import { getAllPlatformStatistics, type PlatformStatisticsData } from '../../lib/PlatformStatistics';
import './index.css';

const AdminDashboard = () => {
  
  // Helper function to format date as YYYY/MM/DD HH:MM:SS
  const formatDateTime = (dateString: string): string => {
    // Check if the date is already in a parsed format
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const [platformStats, setPlatformStats] = useState<PlatformStatisticsData>({
    totalListings: 0,
    successfulMatches: 0,
    pendingConnections: 0,
    activeListings: 0,
    totalInterests: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivityData[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real statistics from database
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const [platformStatsData, activityData, categoryData] = await Promise.all([
          getAllPlatformStatistics(),
          getRecentActivity(),
          getCategoryPerformance()
        ]);
        
        // Set platform statistics data
        setPlatformStats(platformStatsData);
        
        // Set recent activity data
        setRecentActivity(activityData);
        
        // Set category performance data
        setCategoryPerformance(categoryData);
        
        // Animate the stats loading
        const animateStats = () => {
          const increment = {
            totalListings: platformStatsData.totalListings / 30,
            successfulMatches: platformStatsData.successfulMatches / 30,
            pendingConnections: platformStatsData.pendingConnections / 30,
            activeListings: platformStatsData.activeListings / 30,
            totalInterests: platformStatsData.totalInterests / 30
          };

          let currentStats = { ...platformStats };
          let frame = 0;

          const timer = setInterval(() => {
            frame++;
            
            // Animate numeric values only
            (Object.keys(increment) as Array<keyof typeof increment>).forEach(key => {
              if (typeof currentStats[key] === 'number' && typeof increment[key] === 'number') {
                currentStats[key] = Math.min(
                  Math.floor(increment[key] * frame),
                  platformStatsData[key]
                );
              }
            });
            
            // Update with animated values, preserving the sample data flag
            setPlatformStats({ ...currentStats, isUsingSampleData: platformStatsData.isUsingSampleData });
            
            if (frame >= 30) {
              clearInterval(timer);
              setPlatformStats(platformStatsData);
              setLoading(false);
            }
          }, 30);
        };

        animateStats();
      } catch (error) {
        console.error('Error loading statistics:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getStatusBadge = (status: 'active' | 'pending' | 'completed' | 'rejected') => {
    const statusClass = `status-${status}`;
    
    return (
      <span className={`status-badge ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  return (
    <div className="admin-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard - Elfag Resource Platform</h1>
            <p>System overview and management</p>
          </div>
         {/*   <div className="header-right">
            <div className="user-info">
             <span>Welcome, {user?.email}</span> 
              <button onClick={handleSignOut} className="logout-button">
                Sign Out
              </button>
            </div>
          </div>*/}
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="stats-section">
        <h2>Platform Statistics {loading && <span style={{ fontSize: '14px', color: '#666' }}>(Loading...)</span>}</h2>
        
        {platformStats.isUsingSampleData && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '6px', 
            padding: '12px', 
            margin: '10px 0', 
            color: '#856404' 
          }}>
            <strong>⚠️ Using Sample Data</strong> - Database tables not found. Please run the database setup script to see real statistics.
            <br />
            <small>Check DATABASE_SETUP.md for instructions.</small>
          </div>
        )}
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{platformStats.totalListings}</div>
            <div className="stat-label">Total Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{platformStats.successfulMatches}</div>
            <div className="stat-label">Successful Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{platformStats.pendingConnections}</div>
            <div className="stat-label">Pending Connections</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{platformStats.activeListings}</div>
            <div className="stat-label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{platformStats.totalInterests}</div>
            <div className="stat-label">Total Interests</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent System Activity</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Action</th>
                <th>Category</th>
                <th>Region</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, index) => (
                <tr key={index}>
                  <td>{formatDateTime(item.datetime)}</td>
                  <td>{item.action}</td>
                  <td>{item.category}</td>
                  <td>{item.region}</td>
                  <td>{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="activity-section">
        <h2>Category Performance</h2>
        <div className="category-grid">
          {categoryPerformance.map((category, index) => (
            <div key={index} className="category-card">
              <h3>{category.name}</h3>
              <div className="category-stat">
                <span>Total Listings:</span>
                <span>{category.totalListings}</span>
              </div>
              <div className="category-stat">
                <span>Active:</span>
                <span>{category.active}</span>
              </div>
              <div className="category-stat">
                <span>Completed:</span>
                <span>{category.completed}</span>
              </div>
              <div className="category-stat">
                <span>Success Rate:</span>
                <span>{category.successRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;