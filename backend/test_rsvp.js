/**
 * Verification test for Public Accountless Guest RSVP Endpoints (MOD-06)
 */
async function testRsvp() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING ACCOUNTLESS GUEST RSVP VERIFICATION (MOD-06) ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Deepika Padukone',
        email: `deepika_${Date.now()}@example.com`,
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
        partner1Name: 'Ranveer Singh',
        partner2Name: 'Deepika Padukone',
        weddingDate: '2026-11-14',
        city: 'Lake Como',
        venueName: 'Villa del Balbianello',
        theme: 'ROYAL',
      }),
    });
    const createWData = await createWRes.json();
    const weddingId = createWData.data.wedding._id;

    // 3. Create Ceremony Event
    const createEvtRes = await fetch(`${baseUrl}/weddings/${weddingId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: 'Italian Sangeet Night',
        eventType: 'SANGEET',
        date: '2026-11-13',
        startTime: '06:00 PM',
        endTime: '11:00 PM',
      }),
    });
    const createEvtData = await createEvtRes.json();
    const eventId = createEvtData.data._id;

    // 4. Create Guest
    const createGstRes = await fetch(`${baseUrl}/weddings/${weddingId}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        fullName: 'Karan Johar',
        email: 'karan@example.com',
        phone: '+919999988888',
        category: 'VIP',
        invitedEvents: [eventId],
        allocatedAttendees: 2,
        dietaryPreference: 'VEG',
      }),
    });
    const createGstData = await createGstRes.json();
    const guestToken = createGstData.data.invitationToken;

    console.log(`\n1. Created Guest "Karan Johar" with Invitation Token: ${guestToken}`);

    // 5. Test Public GET /api/v1/rsvp/:token (No Auth required)
    console.log('\n2. Testing Public GET /api/v1/rsvp/:token...');
    const getRsvpRes = await fetch(`${baseUrl}/rsvp/${guestToken}`);
    const getRsvpData = await getRsvpRes.json();

    if (!getRsvpRes.ok || !getRsvpData.success) {
      throw new Error(`GET /rsvp/:token failed: ${getRsvpData.message}`);
    }
    console.log('✅ Public RSVP details retrieved:', getRsvpData.data.fullName, '| RSVP Status:', getRsvpData.data.rsvpStatus);

    // 6. Test Public POST /api/v1/rsvp/:token (Confirm attendance, set 2 guests, Jain food, blessings note)
    console.log('\n3. Testing Public POST /api/v1/rsvp/:token (Submit Confirmation & Blessings)...');
    const postRsvpRes = await fetch(`${baseUrl}/rsvp/${guestToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rsvpStatus: 'CONFIRMED',
        attendingCount: 2,
        dietaryPreference: 'JAIN',
        acceptedEvents: [eventId],
        wishes: 'Wishing you both a lifetime of love, laughter, and iconic blockbuster moments!',
      }),
    });
    const postRsvpData = await postRsvpRes.json();

    if (!postRsvpRes.ok || !postRsvpData.success) {
      throw new Error(`POST /rsvp/:token failed: ${postRsvpData.message}`);
    }
    console.log('✅ Public RSVP submitted successfully!');
    console.log('   New Status:', postRsvpData.data.rsvpStatus);
    console.log('   Attending Count:', postRsvpData.data.attendingCount);
    console.log('   Dietary Preference:', postRsvpData.data.dietaryPreference);
    console.log('   Wishes Note:', postRsvpData.data.wishes);

    console.log('\n🎉 ALL MOD-06 BACKEND RSVP TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ RSVP Test Failed:', error.message);
    process.exit(1);
  }
}

testRsvp();
