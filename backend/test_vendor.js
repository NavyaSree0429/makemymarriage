/**
 * Verification test for Vendor Directory & Budget Tracking Endpoints (MOD-08)
 */
async function testVendors() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING VENDOR DIRECTORY & BUDGET TRACKING VERIFICATION (MOD-08) ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Kiara Advani',
        email: `kiara_${Date.now()}@example.com`,
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
        partner1Name: 'Sidharth Malhotra',
        partner2Name: 'Kiara Advani',
        weddingDate: '2026-11-20',
        city: 'Jaisalmer',
        venueName: 'Suryagarh Palace',
        theme: 'ROYAL',
      }),
    });
    const createWData = await createWRes.json();
    const weddingId = createWData.data.wedding._id;

    // 3. Create Vendor Record (POST /api/v1/weddings/:id/vendors)
    console.log('\n1. Testing POST /weddings/:id/vendors (Add Catering Vendor)...');
    const createVendorRes = await fetch(`${baseUrl}/weddings/${weddingId}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        vendorName: 'Royal Rajasthani Caterers & Feasts',
        category: 'CATERING',
        contactPerson: 'Chef Ramesh Kumar',
        phone: '+919876543210',
        email: 'ramesh@feasts.com',
        estimatedBudget: 500000,
        actualCost: 450000,
        paidAmount: 200000,
        notes: 'Includes live chaat counter and royal thali service',
      }),
    });
    const createVendorData = await createVendorRes.json();
    if (!createVendorRes.ok || !createVendorData.success) {
      throw new Error(`Create Vendor failed: ${createVendorData.message}`);
    }
    const vendorId = createVendorData.data._id;
    console.log('✅ Vendor created successfully:', createVendorData.data.vendorName, '| Payment Status:', createVendorData.data.paymentStatus);

    // 4. Get Vendors (GET /api/v1/weddings/:id/vendors)
    console.log('\n2. Testing GET /weddings/:id/vendors...');
    const getVendorsRes = await fetch(`${baseUrl}/weddings/${weddingId}/vendors`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const getVendorsData = await getVendorsRes.json();
    if (!getVendorsRes.ok || !getVendorsData.success) {
      throw new Error(`Get Vendors failed: ${getVendorsData.message}`);
    }
    console.log('✅ Vendors retrieved successfully. Total count:', getVendorsData.data.length);

    // 5. Update Vendor Payment (PUT /api/v1/weddings/:id/vendors/:vendorId)
    console.log('\n3. Testing PUT /weddings/:id/vendors/:vendorId (Record Full Payment)...');
    const updateVendorRes = await fetch(`${baseUrl}/weddings/${weddingId}/vendors/${vendorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        paidAmount: 450000,
      }),
    });
    const updateVendorData = await updateVendorRes.json();
    if (!updateVendorRes.ok || !updateVendorData.success) {
      throw new Error(`Update Vendor failed: ${updateVendorData.message}`);
    }
    console.log('✅ Vendor updated successfully. New Payment Status:', updateVendorData.data.paymentStatus);

    // 6. Delete Vendor (DELETE /api/v1/weddings/:id/vendors/:vendorId)
    console.log('\n4. Testing DELETE /weddings/:id/vendors/:vendorId...');
    const delVendorRes = await fetch(`${baseUrl}/weddings/${weddingId}/vendors/${vendorId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const delVendorData = await delVendorRes.json();
    if (!delVendorRes.ok || !delVendorData.success) {
      throw new Error(`Delete Vendor failed: ${delVendorData.message}`);
    }
    console.log('✅ Vendor record removed successfully!');

    console.log('\n🎉 ALL MOD-08 VENDOR & BUDGET TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Vendor Test Failed:', error.message);
    process.exit(1);
  }
}

testVendors();
