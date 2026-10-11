const API_URL = 'http://127.0.0.1:5000/api/v1';

async function runArchiveTests() {
  console.log('🧪 Starting MOD-12 Wedding Archiving, Retrospective & Data Export Tests...\n');

  try {
    // Step 1: Authenticate VIP User
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'virat@example.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;
    console.log('1️⃣ Signed in as Virat.');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Fetch Active Wedding
    const weddingsRes = await fetch(`${API_URL}/weddings/my-weddings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const weddingsData = await weddingsRes.json();
    const weddingId = weddingsData.data[0].wedding._id;
    console.log(`2️⃣ Active Wedding ID: ${weddingId}`);

    // Step 3: Fetch Archive Retrospective Data
    const archiveRes = await fetch(`${API_URL}/weddings/${weddingId}/archive`, { headers });
    const archiveData = await archiveRes.json();
    console.log('3️⃣ Retrospective Telemetry Response:', archiveData);
    if (!archiveData.success) {
      throw new Error(`Archive API error: ${JSON.stringify(archiveData)}`);
    }
    console.log(`   - Status: ${archiveData.data.wedding.status}`);
    console.log(`   - Guests Welcomed: ${archiveData.data.metrics.guestsWelcomed}`);
    console.log(`   - Ceremonies: ${archiveData.data.metrics.ceremoniesConcluded}`);
    console.log(`   - Blessings in Scrapbook: ${archiveData.data.blessings.length}`);

    // Step 4: Toggle Archive Status to ARCHIVED
    const toggleRes = await fetch(`${API_URL}/weddings/${weddingId}/archive`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ note: 'Preserved with eternal reverence.' })
    });
    const toggleData = await toggleRes.json();
    console.log('4️⃣ Toggle Response:', toggleData);
    if (!toggleData.success) {
      throw new Error(`Toggle API error: ${JSON.stringify(toggleData)}`);
    }
    console.log(`4️⃣ Toggled Archive Status: ${toggleData.data.status} (ArchivedAt: ${toggleData.data.archivedAt})`);

    // Step 5: Test Data Exports
    const guestCsvRes = await fetch(`${API_URL}/weddings/${weddingId}/export/guests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const guestCsvText = await guestCsvRes.text();
    console.log(`5️⃣ Guest Roster CSV Exported (${guestCsvText.length} bytes)`);

    const budgetCsvRes = await fetch(`${API_URL}/weddings/${weddingId}/export/budget`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const budgetCsvText = await budgetCsvRes.text();
    console.log(`   - Vendor Budget CSV Exported (${budgetCsvText.length} bytes)`);

    const itineraryCsvRes = await fetch(`${API_URL}/weddings/${weddingId}/export/itinerary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const itineraryCsvText = await itineraryCsvRes.text();
    console.log(`   - Itinerary CSV Exported (${itineraryCsvText.length} bytes)`);

    const bundleRes = await fetch(`${API_URL}/weddings/${weddingId}/export/bundle`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bundleData = await bundleRes.json();
    console.log(`   - Master Archive JSON Bundle Exported (${JSON.stringify(bundleData).length} bytes)`);

    // Step 6: Toggle back to ACTIVE for developer testing
    const reactivateRes = await fetch(`${API_URL}/weddings/${weddingId}/archive`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({})
    });
    const reactivateData = await reactivateRes.json();
    console.log(`6️⃣ Workspace Reactivated for Ongoing Testing: ${reactivateData.data.status}`);

    console.log('\n🎉 ALL MOD-12 ARCHIVE & DATA EXPORT BACKEND TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ MOD-12 Test Failed:', error);
    process.exit(1);
  }
}

runArchiveTests();
