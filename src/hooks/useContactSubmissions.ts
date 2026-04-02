import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function useContactSubmissions() {
  return useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });
}

export function useCreateContactSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (submission: { name: string; phone: string; email?: string; service?: string; message?: string }) => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert(submission)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-submissions"] }),
  });
}

export function useUpdateContactSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContactSubmission> & { id: string }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-submissions"] }),
  });
}

export function useDeleteContactSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-submissions"] }),
  });
}
