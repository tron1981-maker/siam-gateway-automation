export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          area_sqm: number
          bathrooms: number
          bedrooms: number
          created_at: string
          description: string | null
          description_ko: string | null
          district: string | null
          featured: boolean | null
          floor_number: number | null
          furnishing: Database["public"]["Enums"]["furnishing_type"] | null
          id: string
          images: string[] | null
          land_area_sqm: number | null
          latitude: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          longitude: number | null
          nearby_bts: string | null
          nearby_facilities: string[] | null
          ownership_type: Database["public"]["Enums"]["ownership_type"]
          price: number
          price_per_sqm: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          province: string
          status: Database["public"]["Enums"]["property_status"]
          tag: string | null
          title: string
          title_ko: string | null
          total_floors: number | null
          updated_at: string
          year_built: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area_sqm: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string | null
          description_ko?: string | null
          district?: string | null
          featured?: boolean | null
          floor_number?: number | null
          furnishing?: Database["public"]["Enums"]["furnishing_type"] | null
          id?: string
          images?: string[] | null
          land_area_sqm?: number | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          nearby_bts?: string | null
          nearby_facilities?: string[] | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"]
          price: number
          price_per_sqm?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          province?: string
          status?: Database["public"]["Enums"]["property_status"]
          tag?: string | null
          title: string
          title_ko?: string | null
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area_sqm?: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          description?: string | null
          description_ko?: string | null
          district?: string | null
          featured?: boolean | null
          floor_number?: number | null
          furnishing?: Database["public"]["Enums"]["furnishing_type"] | null
          id?: string
          images?: string[] | null
          land_area_sqm?: number | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          nearby_bts?: string | null
          nearby_facilities?: string[] | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"]
          price?: number
          price_per_sqm?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          province?: string
          status?: Database["public"]["Enums"]["property_status"]
          tag?: string | null
          title?: string
          title_ko?: string | null
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      furnishing_type: "furnished" | "unfurnished" | "partially_furnished"
      listing_type: "sale" | "rent"
      ownership_type: "freehold" | "leasehold"
      property_status: "available" | "sold" | "reserved" | "off_market"
      property_type:
        | "condo"
        | "villa"
        | "penthouse"
        | "house"
        | "townhouse"
        | "land"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      furnishing_type: ["furnished", "unfurnished", "partially_furnished"],
      listing_type: ["sale", "rent"],
      ownership_type: ["freehold", "leasehold"],
      property_status: ["available", "sold", "reserved", "off_market"],
      property_type: [
        "condo",
        "villa",
        "penthouse",
        "house",
        "townhouse",
        "land",
      ],
    },
  },
} as const
