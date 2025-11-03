import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Save or update user information in Supabase
 */
export async function saveUserInfo(firebaseUserId, userData) {
  console.log('Attempting to save user info:', { firebaseUserId, userData });
  
  if (!firebaseUserId) {
    throw new Error('Firebase User ID is required');
  }

  try {
    // First check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select()
      .eq('firebase_uid', firebaseUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing user:', fetchError);
      throw fetchError;
    }

    const userPayload = {
      firebase_uid: firebaseUserId,
      email: userData.email,
      display_name: userData.displayName || userData.name || null,
      updated_at: new Date().toISOString(),
    };

    if (!existingUser) {
      userPayload.created_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(userPayload, {
        onConflict: "firebase_uid",
        returning: "minimal" // Don't need to return the data
      });
    
    if (error) {
      console.error('Error upserting user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error saving user info:", error);
    throw error;
  }
}

/**
 * Save a fitness plan to Supabase
 */
export async function savePlan(firebaseUserId, planData, userFormData) {
  console.log('Saving plan for user:', firebaseUserId);
  try {
    // First ensure user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('firebase_uid', firebaseUserId)
      .single();

    if (userError) {
      console.error('User not found in Supabase:', userError);
      throw new Error('User not found in database. Please try logging out and back in.');
    }

    const { data, error } = await supabase
      .from("fitness_plans")
      .insert({
        firebase_user_id: firebaseUserId,
        plan_data: planData,
        user_form_data: userFormData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving plan:", error);
    throw error;
  }
}

/**
 * Get all plans for a user
 */
export async function getUserPlans(firebaseUserId) {
  console.log('Fetching plans for user:', firebaseUserId);
  try {
    // First check if user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('firebase_uid', firebaseUserId)
      .single();

    if (userError) {
      console.error('User not found in Supabase:', userError);
      throw new Error('User not found in database. Please try logging out and back in.');
    }

    const { data, error } = await supabase
      .from("fitness_plans")
      .select("*")
      .eq("firebase_user_id", firebaseUserId)
      .order('created_at', { ascending: false })
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
}

/**
 * Get a specific plan by ID
 */
export async function getPlanById(planId, firebaseUserId) {
  try {
    const { data, error } = await supabase
      .from("fitness_plans")
      .select("*")
      .eq("id", planId)
      .eq("firebase_user_id", firebaseUserId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw error;
  }
}

/**
 * Delete a plan
 */
export async function deletePlan(planId, firebaseUserId) {
  try {
    const { error } = await supabase
      .from("fitness_plans")
      .delete()
      .eq("id", planId)
      .eq("firebase_user_id", firebaseUserId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
}

