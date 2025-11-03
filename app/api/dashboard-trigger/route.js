import { saveDashboardTrigger, getAndDeleteLatestDashboardTrigger } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firebaseUserId, payload } = body;

    if (!firebaseUserId || !payload) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const saved = await saveDashboardTrigger(firebaseUserId, payload);
    return Response.json({ success: true, trigger: saved });
  } catch (error) {
    console.error('Error saving dashboard trigger:', error);
    return Response.json({ error: error.message || 'Failed to save trigger' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUserId = searchParams.get('userId');

    if (!firebaseUserId) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    const trigger = await getAndDeleteLatestDashboardTrigger(firebaseUserId);
    return Response.json({ trigger });
  } catch (error) {
    console.error('Error fetching dashboard trigger:', error);
    return Response.json({ error: error.message || 'Failed to fetch trigger' }, { status: 500 });
  }
}
