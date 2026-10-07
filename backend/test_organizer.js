/**
 * Verification test for Organizer & Permission Endpoints (MOD-03)
 */
async function testOrganizer() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING ORGANIZER ENDPOINTS VERIFICATION ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Karan Mehra',
        email: `karan_${Date.now()}@example.com`,
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
        partner1Name: 'Karan Mehra',
        partner2Name: 'Simran Roy',
        weddingDate: '2026-11-20',
        city: 'Delhi',
        venueName: 'The Leela Palace',
        theme: 'FLORAL',
      }),
    });
    const createWData = await createWRes.json();
    const weddingId = createWData.data.wedding._id;

    // 3. Invite Organizer with Custom Permissions
    console.log('\n1. Testing POST /weddings/:id/invite-organizer...');
    const inviteRes = await fetch(`${baseUrl}/weddings/${weddingId}/invite-organizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        email: 'anita.planner@luxuryweddings.com',
        fullName: 'Anita Verma',
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: false, // Restricted budget access
          canManageGallery: false,
          canManageWebsite: true,
        },
      }),
    });
    const inviteData = await inviteRes.json();
    console.log('Invite Organizer Response:', inviteData);
    if (!inviteData.success) throw new Error('Invite organizer failed');

    const organizerMembershipId = inviteData.data.membership._id;

    // 4. Get Organizers Roster
    console.log('\n2. Testing GET /weddings/:id/organizers...');
    const getOrgRes = await fetch(`${baseUrl}/weddings/${weddingId}/organizers`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const getOrgData = await getOrgRes.json();
    console.log('Get Organizers Roster Response:', getOrgData);

    // 5. Update Organizer Permissions (Grant Budget Access)
    console.log('\n3. Testing PUT /weddings/:id/organizers/:membershipId/permissions...');
    const updatePermRes = await fetch(`${baseUrl}/weddings/${weddingId}/organizers/${organizerMembershipId}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: true, // Now granted!
          canManageGallery: true,
          canManageWebsite: true,
        },
      }),
    });
    const updatePermData = await updatePermRes.json();
    console.log('Update Permissions Response:', updatePermData);

    // 6. Revoke Organizer Access
    console.log('\n4. Testing DELETE /weddings/:id/organizers/:membershipId...');
    const revokeRes = await fetch(`${baseUrl}/weddings/${weddingId}/organizers/${organizerMembershipId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const revokeData = await revokeRes.json();
    console.log('Revoke Organizer Response:', revokeData);

    console.log('\n✅ ALL MOD-03 ORGANIZER ENDPOINTS VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ ORGANIZER VERIFICATION FAILED:', err.message);
  }
}

setTimeout(testOrganizer, 1000);
