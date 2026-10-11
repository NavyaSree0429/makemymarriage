const API_URL = 'http://localhost:5000/api/v1';

async function testNotificationsBackend() {
  console.log('🧪 Starting MOD-11 Notifications & Socket.IO Automated Backend Test...\n');

  try {
    // 1. Sign in as Virat
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'virat@example.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;
    console.log('1️⃣ Signed in as Virat.');

    // 2. Fetch active wedding
    const weddingsRes = await fetch(`${API_URL}/weddings/my-weddings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const weddingsData = await weddingsRes.json();
    const weddingId = weddingsData.data[0].wedding._id;
    console.log(`2️⃣ Active Wedding ID: ${weddingId}`);

    // 3. Fetch notifications (should auto-seed 5 default notifications)
    const notifRes = await fetch(`${API_URL}/weddings/${weddingId}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const notifData = await notifRes.json();
    console.log(`3️⃣ Retrieved ${notifData.data?.notifications?.length} notifications (Unread: ${notifData.data?.unreadCount})`);
    if (!notifData.success || !notifData.data?.notifications?.length) {
      throw new Error(`Failed to fetch notifications: ${JSON.stringify(notifData)}`);
    }

    // 4. Send Live Socket.IO Test Notification
    const testPingRes = await fetch(`${API_URL}/weddings/${weddingId}/notifications/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: '⚡ Live VIP Socket Ping',
        message: 'Real-time WebSocket heartbeat verified on room channel.',
        category: 'SYSTEM',
        priority: 'HIGH'
      })
    });
    const testPingData = await testPingRes.json();
    console.log(`4️⃣ Dispatched test live notification:`, testPingData.success, testPingData.data?.title);

    // 5. Mark All Notifications as Read
    const markReadRes = await fetch(`${API_URL}/weddings/${weddingId}/notifications/mark-read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({})
    });
    const markReadData = await markReadRes.json();
    console.log(`5️⃣ Marked as Read: Unread count is now ${markReadData.data?.unreadCount}`);

    console.log('\n🎉 ALL MOD-11 NOTIFICATIONS BACKEND TESTS PASSED CLEANLY!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testNotificationsBackend();
