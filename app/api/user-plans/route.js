import { getUserPlans } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUserId = searchParams.get("userId");

    if (!firebaseUserId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const plans = await getUserPlans(firebaseUserId);

    return Response.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return Response.json(
      { error: error.message || "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

