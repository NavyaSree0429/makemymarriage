/**
 * Verification test for Task Planner & Assignment Endpoints (MOD-07)
 */
async function testTasks() {
  const baseUrl = 'http://localhost:5000/api/v1';
  console.log('--- STARTING TASK PLANNER & ASSIGNMENT VERIFICATION (MOD-07) ---');

  try {
    // 1. Signup Owner User
    const ownerRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Alia Bhatt',
        email: `alia_${Date.now()}@example.com`,
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
        partner1Name: 'Ranbir Kapoor',
        partner2Name: 'Alia Bhatt',
        weddingDate: '2026-12-15',
        city: 'Mumbai',
        venueName: 'Vastu, Pali Hill',
        theme: 'ROYAL',
      }),
    });
    const createWData = await createWRes.json();
    const weddingId = createWData.data.wedding._id;

    // 3. Create Task Records (POST /api/v1/weddings/:id/tasks)
    console.log('\n1. Testing POST /weddings/:id/tasks (Create Decor Task)...');
    const createTaskRes = await fetch(`${baseUrl}/weddings/${weddingId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: 'Finalize Floral Mandap Decor & Stage Lighting',
        category: 'DECOR',
        priority: 'URGENT',
        status: 'PENDING',
        dueDate: '2026-12-10',
        assigneeName: 'Ranbir Kapoor',
        notes: 'Needs white marigolds and rose gold drapes',
      }),
    });
    const createTaskData = await createTaskRes.json();
    if (!createTaskRes.ok || !createTaskData.success) {
      throw new Error(`Create Task failed: ${createTaskData.message}`);
    }
    const taskId = createTaskData.data._id;
    console.log('✅ Task created successfully:', createTaskData.data.title, '| Priority:', createTaskData.data.priority);

    // 4. Get Tasks (GET /api/v1/weddings/:id/tasks)
    console.log('\n2. Testing GET /weddings/:id/tasks...');
    const getTasksRes = await fetch(`${baseUrl}/weddings/${weddingId}/tasks`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const getTasksData = await getTasksRes.json();
    if (!getTasksRes.ok || !getTasksData.success) {
      throw new Error(`Get Tasks failed: ${getTasksData.message}`);
    }
    console.log('✅ Tasks retrieved successfully. Total count:', getTasksData.data.length);

    // 5. Update Task (PUT /api/v1/weddings/:id/tasks/:taskId)
    console.log('\n3. Testing PUT /weddings/:id/tasks/:taskId (Update Status to COMPLETED)...');
    const updateTaskRes = await fetch(`${baseUrl}/weddings/${weddingId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        status: 'COMPLETED',
        priority: 'HIGH',
      }),
    });
    const updateTaskData = await updateTaskRes.json();
    if (!updateTaskRes.ok || !updateTaskData.success) {
      throw new Error(`Update Task failed: ${updateTaskData.message}`);
    }
    console.log('✅ Task updated successfully. New status:', updateTaskData.data.status);

    // 6. Delete Task (DELETE /api/v1/weddings/:id/tasks/:taskId)
    console.log('\n4. Testing DELETE /weddings/:id/tasks/:taskId...');
    const delTaskRes = await fetch(`${baseUrl}/weddings/${weddingId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const delTaskData = await delTaskRes.json();
    if (!delTaskRes.ok || !delTaskData.success) {
      throw new Error(`Delete Task failed: ${delTaskData.message}`);
    }
    console.log('✅ Task deleted successfully from workspace planner!');

    console.log('\n🎉 ALL MOD-07 TASK PLANNER TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Task Test Failed:', error.message);
    process.exit(1);
  }
}

testTasks();
