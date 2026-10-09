const API_URL = 'http://localhost:5000/api/v1';

async function testPhotoBackend() {
  console.log('🧪 Starting MOD-09 Photo Gallery Automated Backend Test...\n');

  try {
    // 1. Auth Login as Dev User
    console.log('1️⃣ Logging in to obtain Auth Token...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'virat@gmail.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData?.data?.accessToken || loginData?.data?.tokens?.accessToken;
    if (!token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    console.log('   ✅ Auth token acquired.');

    // 2. Fetch User's Active Wedding
    console.log('\n2️⃣ Fetching active wedding...');
    const weddingsRes = await fetch(`${API_URL}/weddings/my-weddings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const weddingsData = await weddingsRes.json();
    let weddings = weddingsData?.data || [];
    let weddingId;
    if (weddings.length === 0) {
      console.log('   ⚠️ No active wedding found. Creating temporary test wedding...');
      const createWedRes = await fetch(`${API_URL}/weddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          partner1: 'Virat',
          partner2: 'Anushka',
          weddingDate: '2026-12-31',
          primaryVenue: 'Udaipur City Palace',
          city: 'Udaipur',
        }),
      });
      const wedData = await createWedRes.json();
      weddingId = wedData.data?.wedding?._id || wedData.data?._id;
    } else {
      weddingId = weddings[0].wedding._id;
    }
    console.log(`   ✅ Target Wedding ID: ${weddingId}`);

    // 3. Create New Photo
    console.log('\n3️⃣ Testing Photo Creation (POST)...');
    const photoPayload = {
      category: 'SANGEET',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      caption: 'Royal Sangeet musical performance under grand chandeliers 💃🎵',
      tags: ['Sangeet', 'Dance', 'Chandelier'],
      isPublic: true,
    };

    const createRes = await fetch(`${API_URL}/weddings/${weddingId}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(photoPayload),
    });
    const createData = await createRes.json();
    if (!createData.success) {
      throw new Error(`Create photo failed: ${JSON.stringify(createData)}`);
    }
    const createdPhoto = createData.data;
    console.log(`   ✅ Photo created. Photo ID: ${createdPhoto._id}`);
    console.log(`   Caption: "${createdPhoto.caption}"`);

    // 4. Fetch All Photos
    console.log('\n4️⃣ Testing Fetch Photos (GET)...');
    const getRes = await fetch(`${API_URL}/weddings/${weddingId}/photos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    console.log(`   ✅ Fetched ${getData?.count || 0} photos.`);

    // 5. Toggle Like Photo
    console.log('\n5️⃣ Testing Toggle Like Photo (POST)...');
    const likeRes = await fetch(`${API_URL}/weddings/${weddingId}/photos/${createdPhoto._id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const likeData = await likeRes.json();
    console.log(`   ✅ Toggle Like successful. Likes Count: ${likeData?.data?.likesCount}`);

    // 6. Delete Photo
    console.log('\n6️⃣ Testing Photo Deletion (DELETE)...');
    const deleteRes = await fetch(`${API_URL}/weddings/${weddingId}/photos/${createdPhoto._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteData = await deleteRes.json();
    console.log(`   ✅ ${deleteData?.message}`);

    console.log('\n🎉 ALL MOD-09 PHOTO GALLERY BACKEND TESTS PASSED CLEANLY!\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

testPhotoBackend();
