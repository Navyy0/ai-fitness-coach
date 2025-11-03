import { savePlan, saveUserInfo } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received save plan request:', body);

    const { firebaseUserId, planData, userFormData, userInfo } = body;

    if (!firebaseUserId) {
      console.error('Missing firebaseUserId');
      return Response.json({ error: "Missing firebaseUserId" }, { status: 400 });
    }

    // If userInfo provided (e.g., onAuthStateChanged sync), update/create the user
    let savedPlan = null;
    if (userInfo) {
      try {
        await saveUserInfo(firebaseUserId, userInfo);
      } catch (err) {
        console.error('Failed to save user info:', err);
        // continue; don't block plan saving if user info upsert fails
      }
    }

    // Only save a plan when planData is provided (explicit save action)
    if (planData) {
      savedPlan = await savePlan(firebaseUserId, planData, userFormData);
      return Response.json({ success: true, plan: savedPlan });
    }

    // If we reach here, it was a userInfo-only sync
    return Response.json({ success: true, message: 'User info synced' });
  } catch (error) {
    console.error("Error saving plan:", error);
    return Response.json(
      { error: error.message || "Failed to save plan" },
      { status: 500 }
    );
  }
}

