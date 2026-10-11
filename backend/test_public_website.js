const API_URL = 'http://localhost:5000/api/v1';

async function testPublicWebsiteBackend() {
  console.log('🧪 Starting MOD-10 Public Wedding Website Automated Backend Test...\n');

  try {
    // 1. Fetch Public Wedding Details by Slug (Unauthenticated)
    const testSlug = 'virat-anushka';
    console.log(`1️⃣ Fetching public wedding portal for slug: "${testSlug}"...`);
    
    const response = await fetch(`${API_URL}/public/weddings/${testSlug}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(`Failed to fetch public wedding: ${JSON.stringify(data)}`);
    }

    const { wedding, events, photos } = data.data;

    console.log(`   ✅ Public Wedding Portal Found!`);
    console.log(`   Couple: ${wedding.partnerNames.partner1} & ${wedding.partnerNames.partner2}`);
    console.log(`   Wedding Date: ${wedding.weddingDate}`);
    console.log(`   Primary Venue: ${wedding.primaryLocation.venueName}, ${wedding.primaryLocation.city}`);
    console.log(`   Events Scheduled: ${events.length}`);
    console.log(`   Public Photos: ${photos.length}`);

    console.log('\n🎉 ALL MOD-10 PUBLIC WEDDING WEBSITE BACKEND TESTS PASSED CLEANLY!\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

testPublicWebsiteBackend();
