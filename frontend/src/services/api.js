const API_BASE = '/api';

const toQueryString = (params = {}) => {
  const clean = Object.entries(params).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'undefined') {
      acc[k] = v;
    }
    return acc;
  }, {});
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
};

const parseJson = async (res) => {
  const text = await res.text();
  if (!text) {
    throw new Error(
      res.ok
        ? 'Máy chủ không trả dữ liệu. Hãy chạy npm run backend rồi thử lại.'
        : 'Không kết nối được backend (cổng 5000). Hãy chạy npm run backend.'
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Backend trả về dữ liệu không hợp lệ. Kiểm tra npm run backend.');
  }
};

export const api = {
  login: async (data) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`);
    return parseJson(res);
  },

  // Candidates
  getCandidates: async (params = {}) => {
    const res = await fetch(`${API_BASE}/candidates${toQueryString(params)}`);
    return parseJson(res);
  },
  createCandidate: async (data) => {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  updateCandidate: async (id, data) => {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  deleteCandidate: async (id) => {
    const res = await fetch(`${API_BASE}/candidates/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Positions
  getPositions: async () => {
    const res = await fetch(`${API_BASE}/positions`);
    return parseJson(res);
  },
  createPosition: async (data) => {
    const res = await fetch(`${API_BASE}/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  updatePosition: async (id, data) => {
    const res = await fetch(`${API_BASE}/positions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  deletePosition: async (id) => {
    const res = await fetch(`${API_BASE}/positions/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Departments
  getDepartments: async () => {
    const res = await fetch(`${API_BASE}/departments`);
    return parseJson(res);
  },
  createDepartment: async (data) => {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },

  // Applications
  getApplications: async (params = {}) => {
    const res = await fetch(`${API_BASE}/applications${toQueryString(params)}`);
    return parseJson(res);
  },
  createApplication: async (data) => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  updateApplicationStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    return parseJson(res);
  },
  deleteApplication: async (id) => {
    const res = await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Interviews
  getInterviews: async () => {
    const res = await fetch(`${API_BASE}/interviews`);
    return parseJson(res);
  },
  createInterview: async (data) => {
    const res = await fetch(`${API_BASE}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  updateInterview: async (id, data) => {
    const res = await fetch(`${API_BASE}/interviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  deleteInterview: async (id) => {
    const res = await fetch(`${API_BASE}/interviews/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Reports
  getReports: async () => {
    const res = await fetch(`${API_BASE}/reports`);
    return parseJson(res);
  },

  // Employees (Collection 6)
  getEmployees: async (params = {}) => {
    const res = await fetch(`${API_BASE}/employees${toQueryString(params)}`);
    return parseJson(res);
  },
  createEmployee: async (data) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  convertCandidateToEmployee: async (data) => {
    const res = await fetch(`${API_BASE}/employees/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  updateEmployee: async (id, data) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  deleteEmployee: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Department updates
  updateDepartment: async (id, data) => {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJson(res);
  },
  deleteDepartment: async (id) => {
    const res = await fetch(`${API_BASE}/departments/${id}`, { method: 'DELETE' });
    return parseJson(res);
  },

  // Mingo Explain Plan
  getExplainPlan: async (params = {}) => {
    const res = await fetch(`${API_BASE}/mingo/explain${toQueryString(params)}`);
    return parseJson(res);
  }
};
