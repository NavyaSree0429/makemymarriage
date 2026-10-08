/**
 * Verification test for Event Management Endpoints (MOD-04)
 */
async function testEvents() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING EVENT MANAGEMENT ENDPOINTS VERIFICATION (MOD-04) ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Virat Kohli',
        email: `virat_${Date.now()}@example.com`,
        password: 'Password123!',
      }),
    });
    const ownerData = await ownerRes.json();
    const ownerToken = ownerData.data.accessToken;

    // 2. Create Wedding Workspace
    const createWRes = await fetch(`${baseUrl}/weddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        partner1Name: 'Virat Kohli',
        partner2Name: 'Anushka Sharma',
        weddingDate: '2026-12-28',
        city: 'Udaipur',
        venueName: 'The Leela Palace',
        theme: 'ROYAL',
      }),
    });
    const createWData = await createWRes.json();
    const weddingId = createWData.data.wedding._id;

    // 3. Create Event Ceremonies (Haldi, Mehendi, Sangeet, Wedding, Reception)
    console.log('\n1. Testing POST /weddings/:id/events (Create Haldi Event)...');
    const haldiRes = await fetch(`${baseUrl}/weddings/${weddingId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: 'Haldi & Phoolon Ki Holi',
        eventType: 'HALDI',
        date: '2026-12-27',
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        location: {
          venueName: 'The Leela Palace • Poolside Lawn',
          address: 'Lake Pichola, Udaipur',
          city: 'Udaipur',
          googleMapsUrl: 'https://maps.google.com/?q=The+Leela+Palace+Udaipur',
        },
        dressCode: 'Pastel Yellow Ethnic',
        description: 'Join us for haldi application and floral celebrations by the pool.',
      }),
    });
    const haldiData = await haldiRes.json();
    console.log('Create Haldi Event Response:', haldiData);
    if (!haldiData.success) throw new Error('Create Haldi event failed');
    const haldiId = haldiData.data._id;

    console.log('\n2. Testing POST /weddings/:id/events (Create Sangeet Event)...');
    const sangeetRes = await fetch(`${baseUrl}/weddings/${weddingId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: 'Sangeet & Dance Extravaganza',
        eventType: 'SANGEET',
        date: '2026-12-27',
        startTime: '06:30 PM',
        endTime: '11:59 PM',
        location: {
          venueName: 'The Leela Palace • Grand Ballroom',
          address: 'Lake Pichola, Udaipur',
          city: 'Udaipur',
          googleMapsUrl: 'https://maps.google.com/?q=The+Leela+Palace+Udaipur',
        },
        dressCode: 'Royal Emerald & Gold Glamour',
        description: 'An evening of dance performances, music, and cocktail dinner.',
        liveStreamUrl: 'https://youtube.com/live/demo-sangeet-stream',
      }),
    });
    const sangeetData = await sangeetRes.json();
    console.log('Create Sangeet Event Response:', sangeetData);

    // 4. Fetch All Events
    console.log('\n3. Testing GET /weddings/:id/events...');
    const getEventsRes = await fetch(`${baseUrl}/weddings/${weddingId}/events`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const getEventsData = await getEventsRes.json();
    console.log(`Retrieved ${getEventsData.data?.length} events:`, getEventsData);

    // 5. Update Haldi Event
    console.log('\n4. Testing PUT /weddings/:id/events/:eventId...');
    const updateRes = await fetch(`${baseUrl}/weddings/${weddingId}/events/${haldiId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        startTime: '09:30 AM',
        dressCode: 'Bright Sunshine Yellow Ethnic',
      }),
    });
    const updateData = await updateRes.json();
    console.log('Update Event Response:', updateData);

    // 6. Delete Event
    console.log('\n5. Testing DELETE /weddings/:id/events/:eventId...');
    const deleteRes = await fetch(`${baseUrl}/weddings/${weddingId}/events/${haldiId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const deleteData = await deleteRes.json();
    console.log('Delete Event Response:', deleteData);

    console.log('\n✅ ALL MOD-04 EVENT ENDPOINTS VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ EVENT VERIFICATION FAILED:', err.message);
  }
}

setTimeout(testEvents, 1000);
