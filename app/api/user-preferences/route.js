import { saveUserPreferences, getUserPreferences } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUserId = searchParams.get('userId');
    if (!firebaseUserId) return Response.json({ error: 'User ID required' }, { status: 400 });

    const preferences = await getUserPreferences(firebaseUserId);
    return Response.json({ preferences });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return Response.json({ error: error.message || 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { firebaseUserId, preferences } = body;
    if (!firebaseUserId || !preferences) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const saved = await saveUserPreferences(firebaseUserId, preferences);
    return Response.json({ success: true, saved });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return Response.json({ error: error.message || 'Failed to save preferences' }, { status: 500 });
  }
}
