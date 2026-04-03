import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProperty {
  id: string;
  slug: string;
  title: string;
  location: string;
  district: string;
  price: string;
  price_num: number;
  price_per_m2: string;
  area: string;
  area_num: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  roi: string;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
  amenities: string[];
  developer: string;
  year_built: string;
  floors: number;
  parking: string;
  nearby_places: string[];
  sort_order: number;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  detail_sections: DetailSection[];
  created_at: string;
  updated_at: string;
}

export interface DetailSection {
  id: string;
  title: string;
  description: string;
  images: string[];
  icon: string;
}

export function useReorderProperties() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      for (const item of items) {
        const { error } = await supabase
          .from("properties")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["properties-all"] });
    },
  });
}

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data as unknown as DbProperty[]);
    },
  });
}

export function useAllProperties() {
  return useQuery({
    queryKey: ["properties-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as DbProperty[];
    },
  });
}

export function usePropertyBySlug(slug: string) {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as DbProperty | null;
    },
    enabled: !!slug,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (property: Partial<DbProperty>) => {
      const { data, error } = await supabase
        .from("properties")
        .insert(property as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbProperty> & { id: string }) => {
      const { data, error } = await supabase
        .from("properties")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["properties-all"] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["properties-all"] });
    },
  });
}
