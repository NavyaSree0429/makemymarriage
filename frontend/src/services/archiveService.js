import { apiRequest } from './api';

/**
 * Fetch retrospective archive data (metrics, blessings, summary)
 */
export async function getArchiveRetrospectiveApi(token, weddingId) {
  return apiRequest(`/weddings/${weddingId}/archive`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Toggle workspace between ARCHIVED and ACTIVE
 */
export async function toggleArchiveStatusApi(token, weddingId, note = '') {
  return apiRequest(`/weddings/${weddingId}/archive`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ note }),
  });
}

/**
 * Trigger file download for guests, budget, itinerary, or bundle
 */
export async function downloadExportApi(token, weddingId, type) {
  const filenameMap = {
    guests: 'MakeMyMarriage_Guest_Roster.csv',
    budget: 'MakeMyMarriage_Vendor_Budget_Ledger.csv',
    itinerary: 'MakeMyMarriage_Ceremony_Chronology.csv',
    bundle: 'MakeMyMarriage_Master_Archive_Vault.json',
  };

  const filename = filenameMap[type] || `MakeMyMarriage_${type}_Export.csv`;

  const response = await fetch(`/api/v1/weddings/${weddingId}/export/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  let blob;
  if (type === 'bundle') {
    const jsonData = await response.json();
    blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  } else {
    const textData = await response.text();
    blob = new Blob([textData], { type: 'text/csv' });
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return true;
}
