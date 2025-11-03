import { useQuery } from "@tanstack/react-query";

export function usePlan(formData) {
  return useQuery({
    queryKey: ["fitness-plan", formData],
    queryFn: async () => {
      if (!formData) return null;
      
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate plan");
      }
      
      return res.json();
    },
    enabled: !!formData && !!formData.name && !!formData.goal,
    staleTime: Infinity, // Don't refetch automatically
  });
}

