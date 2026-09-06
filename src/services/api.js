const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('safetyai_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  login: async (orgId, email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ org_id: orgId, email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid login credentials');
    }
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Reports
  submitReport: async (reportData) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit report' }));
      throw new Error(err.detail || 'Failed to submit report');
    }
    return res.json();
  },

  getReports: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.report_type && filters.report_type !== 'ALL') params.append('report_type', filters.report_type);
    if (filters.analysis_status && filters.analysis_status !== 'ALL') params.append('analysis_status', filters.analysis_status);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/reports${queryStr}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  getReportById: async (reportId) => {
    const res = await fetch(`${API_BASE}/reports/${reportId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch report details');
    return res.json();
  },

  triggerAnalysis: async (reportId) => {
    const res = await fetch(`${API_BASE}/reports/${reportId}/analyze`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to execute AI analysis');
    return res.json();
  },

  getAnalyses: async () => {
    const res = await fetch(`${API_BASE}/analysis`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch analyses');
    return res.json();
  },

  getSIFIntelligence: async () => {
    const res = await fetch(`${API_BASE}/sif-intelligence`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch SIF intelligence');
    return res.json();
  },

  getSIFPatterns: async () => {
    const res = await fetch(`${API_BASE}/sif-intelligence/patterns`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch SIF patterns and hotspot matrix');
    return res.json();
  },

  // Feedback
  submitFeedback: async (reportId, feedbackStatus, feedbackText) => {
    const res = await fetch(`${API_BASE}/feedback/reports/${reportId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        feedback_status: feedbackStatus,
        feedback_text: feedbackText
      })
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  getPendingReviewReports: async () => {
    const res = await fetch(`${API_BASE}/feedback/pending`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch pending reviews');
    return res.json();
  },

  getAllFeedback: async () => {
    const res = await fetch(`${API_BASE}/feedback/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch feedback history');
    return res.json();
  },

  // Dynamic Dashboard
  getDashboardData: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  }
};
