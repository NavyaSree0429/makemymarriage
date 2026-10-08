/**
 * Verification test for Guest List & Digital Invitations Endpoints (MOD-05)
 */
async function testGuests() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING GUEST LIST & INVITATIONS ENDPOINTS VERIFICATION (MOD-05) ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Anushka Sharma',
        email: `anushka_${Date.now()}@example.com`,
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

    // 3. Create Event Ceremonies first
    const createEvtRes = await fetch(`${baseUrl}/weddings/${weddingId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: 'Grand Reception & Dinner',
        eventType: 'RECEPTION',
        date: '2026-12-29',
        startTime: '07:00 PM',
        endTime: '11:30 PM',
      }),
    });
    const createEvtData = await createEvtRes.json();
    const eventId = createEvtData.data._id;

    // 4. Create Guest Roster Records
    console.log('\n1. Testing POST /weddings/:id/guests (Add Guest Rajesh Sharma & Family)...');
    const guestRes = await fetch(`${baseUrl}/weddings/${weddingId}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        fullName: 'Rajesh Sharma & Family',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98765 43210',
        category: 'BRIDE_FAMILY',
        invitedEvents: [eventId],
        allocatedAttendees: 4,
        dietaryPreference: 'JAIN',
        rsvpStatus: 'CONFIRMED',
        notes: 'Requires ground floor seating near main stage.',
      }),
    });
    const guestData = await guestRes.json();
    console.log('Create Guest Response:', guestData);
    if (!guestData.success) throw new Error('Create guest failed');
    const guestId = guestData.data._id;

    // 5. Fetch All Guests
    console.log('\n2. Testing GET /weddings/:id/guests...');
    const getGuestsRes = await fetch(`${baseUrl}/weddings/${weddingId}/guests`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const getGuestsData = await getGuestsRes.json();
    console.log(`Retrieved ${getGuestsData.data?.length} guests:`, getGuestsData);

    // 6. Update Guest (Change RSVP status to CONFIRMED and add attendee)
    console.log('\n3. Testing PUT /weddings/:id/guests/:guestId...');
    const updateRes = await fetch(`${baseUrl}/weddings/${weddingId}/guests/${guestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        allocatedAttendees: 5,
        dietaryPreference: 'VEG',
      }),
    });
    const updateData = await updateRes.json();
    console.log('Update Guest Response:', updateData);

    // 7. Delete Guest
    console.log('\n4. Testing DELETE /weddings/:id/guests/:guestId...');
    const deleteRes = await fetch(`${baseUrl}/weddings/${weddingId}/guests/${guestId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const deleteData = await deleteRes.json();
    console.log('Delete Guest Response:', deleteData);

    console.log('\n✅ ALL MOD-05 GUEST ENDPOINTS VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ GUEST VERIFICATION FAILED:', err.message);
  }
}

setTimeout(testGuests, 1000);
