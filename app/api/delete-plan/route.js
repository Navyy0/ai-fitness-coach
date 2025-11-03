import { deletePlan } from "@/lib/supabase";

export async function DELETE(req) {
  try {
    const { planId, firebaseUserId } = await req.json();

    if (!planId || !firebaseUserId) {
      return Response.json(
        { error: "Plan ID and User ID are required" },
        { status: 400 }
      );
    }

    await deletePlan(planId, firebaseUserId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return Response.json(
      { error: error.message || "Failed to delete plan" },
      { status: 500 }
    );
  }
}

