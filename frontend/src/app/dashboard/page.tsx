'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaDonate, FaSync, FaCalendarAlt, FaCreditCard, FaUser, FaSignOutAlt, FaCheckCircle, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import styles from './page.module.css';

interface Donation {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  status: string;
  payment_method: string;
  created_at: string;
}

interface Subscription {
  id: string;
  razorpay_subscription_id: string;
  amount: number;
  currency: string;
  subscriber_name: string;
  subscriber_email: string;
  status: string;
  current_start_date?: string;
  current_end_date?: string;
  charge_at_date?: string;
  total_count: number;
  paid_count: number;
  remaining_count: number;
  created_at: string;
}

interface SubscriptionPayment {
  id: string;
  razorpay_payment_id: string;
  amount: number;
  status: string;
  payment_date: string;
  razorpay_subscription_id: string;
}

interface DashboardData {
  donations: Donation[];
  subscriptions: Subscription[];
  payments: SubscriptionPayment[];
  stats: {
    total_donations: number;
    total_donation_amount: number;
    active_subscriptions: number;
    total_monthly_amount: number;
    total_subscription_payments: number;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface SessionResponse {
  success: boolean;
  user: UserProfile | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'subscriptions'>('overview');
  const [managingSubscription, setManagingSubscription] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchDashboardData = async () => {
    try {
      const sessionRes = await fetch('/api/user/session');

      if (sessionRes.status === 401) {
        router.push('/login');
        return;
      }

      if (!sessionRes.ok) {
        throw new Error('Failed to fetch user session');
      }

      const sessionData: SessionResponse = await sessionRes.json();

      if (!sessionData.success || !sessionData.user) {
        router.push('/login');
        return;
      }

      setUser(sessionData.user);

      const [donationsRes, subscriptionsRes] = await Promise.all([
        fetch('/api/user/donations'),
        fetch('/api/user/subscriptions')
      ]);

      // Check if user is authenticated
      if (donationsRes.status === 401 || subscriptionsRes.status === 401) {
        router.push('/login');
        return;
      }

      if (!donationsRes.ok || !subscriptionsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const donationsData = await donationsRes.json();
      const subscriptionsData = await subscriptionsRes.json();

      setData({
        donations: donationsData.donations || [],
        subscriptions: subscriptionsData.subscriptions || [],
        payments: subscriptionsData.payments || [],
        stats: {
          total_donations: donationsData.total_donations || 0,
          total_donation_amount: donationsData.total_amount || 0,
          active_subscriptions: subscriptionsData.active_subscriptions || 0,
          total_monthly_amount: subscriptionsData.total_monthly_amount || 0,
          total_subscription_payments: subscriptionsData.total_subscription_payments || 0,
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const manageSubscription = async (subscriptionId: string, action: 'pause' | 'resume'| 'cancel') => {
    try {
      setManagingSubscription(subscriptionId);
      
      const response = await fetch('/api/razorpay/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          action: action
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Subscription ${action}d successfully!`);
        // Refresh the data only once
        await fetchDashboardData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing subscription:`, error);
      alert(`Failed to ${action} subscription. Please try again.`);
    } finally {
      setManagingSubscription(null);
    }
  };

  const confirmAction = (subscriptionId: string, action: 'pause' | 'resume'| 'cancel') => {
    const actionText = action;
    const warningText = action === 'pause'
      ? 'This will pause your subscription. You can resume it anytime from this dashboard.'
      : action === 'cancel' ? 
      'This will cancel your subscription and monthly billing will discontinue.' : 'This will resume your subscription and monthly billing will continue';
    
    if (confirm(`Are you sure you want to ${actionText} this subscription?\n\n${warningText}`)) {
      manageSubscription(subscriptionId, action);
    }
  };

  const syncSubscriptionWithRazorpay = async (subscriptionId: string, refreshAfter: boolean = false) => {
    try {
      console.log('Syncing subscription with Razorpay:', subscriptionId);
      const response = await fetch(`/api/razorpay/subscription?subscription_id=${subscriptionId}`);
      if (response.ok) {
        const result = await response.json();
        console.log('Razorpay sync result:', result);
        // Only refresh if explicitly requested
        if (refreshAfter) {
          await fetchDashboardData();
        }
      }
    } catch (error) {
      console.error('Error syncing with Razorpay:', error);
    }
  };

  const handleTabChange = async (tab: 'overview' | 'donations' | 'subscriptions') => {
    setActiveTab(tab);
    
    // When switching to subscriptions tab, sync with Razorpay for fresh data
    if (tab === 'subscriptions' && data && data.subscriptions.length > 0 && !syncing) {
      setSyncing(true);
      console.log('Syncing all subscriptions with Razorpay...');
      
      // Sync all subscriptions without individual refreshes
      const syncPromises = data.subscriptions.map(subscription => 
        syncSubscriptionWithRazorpay(subscription.razorpay_subscription_id, false)
      );
      
      await Promise.all(syncPromises);
      
      // Refresh data only once after all syncs are complete
      await fetchDashboardData();
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your donation history...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load dashboard</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Donation Dashboard</h1>
        <p className={styles.subtitle}>Track your contributions and manage your subscriptions</p>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Left Column - User Info & Stats */}
        <div className={styles.leftColumn}>
          {user && (
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>
                <FaUser />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{user.name}</div>
                <div className={styles.profileEmail}>{user.email}</div>
              </div>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FaHeart /></div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{data.stats.total_donations}</div>
                <div className={styles.statLabel}>Total Donations</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FaDonate /></div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{formatCurrency(data.stats.total_donation_amount)}</div>
                <div className={styles.statLabel}>Total Donated</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FaSync /></div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{data.stats.active_subscriptions}</div>
                <div className={styles.statLabel}>Active Subscriptions</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FaCalendarAlt /></div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{formatCurrency(data.stats.total_monthly_amount)}</div>
                <div className={styles.statLabel}>Monthly Commitment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - History & Tabs */}
        <div className={styles.rightColumn}>
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'donations' ? styles.active : ''}`}
              onClick={() => handleTabChange('donations')}
            >
              One-time Donations
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'subscriptions' ? styles.active : ''}`}
              onClick={() => handleTabChange('subscriptions')}
            >
              Monthly Subscriptions
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Recent Activity</h3>
                  <div className={styles.activityList}>
                    {/* Recent donations */}
                    {data.donations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}><FaCreditCard /></div>
                        <div className={styles.activityDetails}>
                          <div className={styles.activityTitle}>One-time donation</div>
                          <div className={styles.activityMeta}>
                            {formatCurrency(donation.amount)} • {formatDate(donation.created_at)}
                          </div>
                        </div>
                        <div className={styles.activityStatus}>
                          <span className={styles.statusBadge}>{donation.status}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Recent subscription payments */}
                    {data.payments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}><FaSync /></div>
                        <div className={styles.activityDetails}>
                          <div className={styles.activityTitle}>Monthly subscription payment</div>
                          <div className={styles.activityMeta}>
                            {formatCurrency(payment.amount)} • {formatDate(payment.payment_date)}
                          </div>
                        </div>
                        <div className={styles.activityStatus}>
                          <span className={styles.statusBadge}>{payment.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {data.subscriptions.length > 0 && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Active Subscriptions</h3>
                    <div className={styles.subscriptionsList}>
                      {data.subscriptions
                        .filter((sub: any) => ['active', 'authenticated', 'activated'].includes(sub.status?.toLowerCase()))
                        .map((subscription) => (
                        <div key={subscription.id} className={styles.subscriptionCard}>
                          <div className={styles.subscriptionHeader}>
                            <h4 className={styles.subscriptionTitle}>Monthly Donation</h4>
                            <span className={styles.subscriptionStatus}>
                              {(subscription as any).status}
                            </span>
                          </div>
                          <div className={styles.subscriptionDetails}>
                            <div className={styles.subscriptionAmount}>
                              {formatCurrency(subscription.amount)}/month
                            </div>
                            <div className={styles.subscriptionMeta}>
                              Started: {formatDate(subscription.created_at)}
                            </div>
                            {subscription.charge_at_date && (
                              <div className={styles.subscriptionMeta}>
                                Next charge: {formatDate(subscription.charge_at_date)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donations' && (
              <div className={styles.donations}>
                {data.donations.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><FaHeart /></div>
                    <h3 className={styles.emptyTitle}>No donations yet</h3>
                    <p className={styles.emptyText}>
                      You haven't made any one-time donations yet. Start making a difference today!
                    </p>
                    <a href="/donate" className={styles.donateButton}>
                      Make a Donation
                    </a>
                  </div>
                ) : (
                  <div className={styles.donationsList}>
                    {data.donations.map((donation) => (
                      <div key={donation.id} className={styles.donationCard}>
                        <div className={styles.donationHeader}>
                          <div className={styles.donationAmount}>
                            {formatCurrency(donation.amount)}
                          </div>
                          <span className={`${styles.statusBadge} ${styles[donation.status]}`}>
                            {donation.status}
                          </span>
                        </div>
                        <div className={styles.donationDetails}>
                          <div className={styles.donationMeta}>
                            <strong>Payment ID:</strong> {donation.razorpay_payment_id}
                          </div>
                          <div className={styles.donationMeta}>
                            <strong>Method:</strong> {donation.payment_method}
                          </div>
                          <div className={styles.donationMeta}>
                            <strong>Date:</strong> {formatDate(donation.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className={styles.subscriptions}>
                {data.subscriptions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><FaSync /></div>
                    <h3 className={styles.emptyTitle}>No subscriptions yet</h3>
                    <p className={styles.emptyText}>
                      Set up a monthly subscription to make a sustained impact on our community.
                    </p>
                    <a href="/donate" className={styles.donateButton}>
                      Start Monthly Donation
                    </a>
                  </div>
                ) : (
                  <div className={styles.subscriptionsList}>
                    {data.subscriptions.map((subscription) => (
                      <div key={subscription.id} className={styles.subscriptionCard}>
                        <div className={styles.subscriptionHeader}>
                          <h4 className={styles.subscriptionTitle}>
                            Monthly Donation - {formatCurrency(subscription.amount)}
                          </h4>
                          <span className={`${styles.statusBadge} ${styles[(subscription as any).status]}`}>
                            {(subscription as any).status}
                          </span>
                        </div>
                        <div className={styles.subscriptionDetails}>
                          <div className={styles.subscriptionMeta}>
                            <strong>Subscription ID:</strong> {subscription.razorpay_subscription_id}
                          </div>
                          <div className={styles.subscriptionMeta}>
                            <strong>Started:</strong> {formatDate(subscription.created_at)}
                          </div>
                          {subscription.charge_at_date && (
                            <div className={styles.subscriptionMeta}>
                              <strong>Next Payment:</strong> {formatDate(subscription.charge_at_date)}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.subscriptionActions}>
                          {['active', 'authenticated', 'activated'].includes((subscription as any).status?.toLowerCase()) && (
                            <>
                              <button 
                                className={`${styles.manageButton} ${styles.pauseButton}`}
                                onClick={() => confirmAction(subscription.razorpay_subscription_id, 'pause')}
                                disabled={managingSubscription === subscription.razorpay_subscription_id}
                              >
                                <FaPause /> {managingSubscription === subscription.razorpay_subscription_id ? 'Processing...' : 'Pause Subscription'}
                              </button>
                              <button 
                                className={`${styles.manageButton} ${styles.deleteButton}`}
                                onClick={() => confirmAction(subscription.razorpay_subscription_id, 'cancel')}
                                disabled={managingSubscription === subscription.razorpay_subscription_id}
                              >
                                <FaTimes /> {managingSubscription === subscription.razorpay_subscription_id ? 'Cancelling...' : 'Cancel Subscription'}
                              </button>
                            </>
                          )}
                          
                          {(subscription as any).status?.toLowerCase() === 'paused' && (
                            <>
                              <button 
                                className={`${styles.manageButton} ${styles.resumeButton}`}
                                onClick={() => confirmAction(subscription.razorpay_subscription_id, 'resume')}
                                disabled={managingSubscription === subscription.razorpay_subscription_id}
                              >
                                <FaPlay /> {managingSubscription === subscription.razorpay_subscription_id ? 'Processing...' : 'Resume Subscription'}
                              </button>
                              <button 
                                className={`${styles.manageButton} ${styles.deleteButton}`}
                                onClick={() => confirmAction(subscription.razorpay_subscription_id, 'cancel')}
                                disabled={managingSubscription === subscription.razorpay_subscription_id}
                              >
                                <FaTimes /> {managingSubscription === subscription.razorpay_subscription_id ? 'Cancelling...' : 'Cancel Subscription'}
                              </button>
                            </>
                          )}
                          
                          {['cancelled', 'canceled'].includes((subscription as any).status?.toLowerCase()) && (
                            <p className={styles.cancelledNote}>
                              <FaTimes /> This subscription has been cancelled. <a href="/donate">Start a new subscription</a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}