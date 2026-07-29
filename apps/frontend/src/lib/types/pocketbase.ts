import type { RecordModel } from "pocketbase";

// ============================================================================
// BASE RECORD (Campos comunes que PocketBase añade siempre)
// ============================================================================
export interface BaseRecord extends RecordModel {
  id: string;
  created: string;
  updated?: string;
  collectionId: string;
  collectionName: string;
}

// ============================================================================
// ENUMS & UNIONS
// ============================================================================
export type StoreStatus = "pending" | "approved" | "suspended" | string;
export type StoreMembershipType = "free" | "premium" | "enterprise" | string;
export type ProductCondition = "new" | "open_box" | "used";

// ============================================================================
// 1. USERS COLLECTION (Type: Auth)
// ============================================================================
export interface UserRecord extends BaseRecord {
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name?: string;
  avatar?: string;
}

// ============================================================================
// 2. CATEGORIES COLLECTION (Type: Base)
// ============================================================================
export interface CategoryRecord extends BaseRecord {
  name: string;
  slug: string;
  icon: string;
  image?: string;
}

export interface ExtendedCategoryRecord extends CategoryRecord {
  parent_id?: string;
  gradient?: string;
  textColor?: string;
}

// ============================================================================
// 3. STORES COLLECTION (Type: Base)
// ============================================================================
export interface StoreRecord extends BaseRecord {
  owner: string; // Relation -> users (Nonempty)
  name: string; // Text (Nonempty)
  slug: string; // Text (Nonempty)
  instagram: string; // Text (Nonempty)
  whatsapp: string; // Text (Nonempty)
  correo: string; // Email (Nonempty)
  category?: string | string[]; // Relación simple o múltiple -> categories
  description?: string; // Text
  location?: string; // Text
  status?: StoreStatus; // Select Single
  membership_type?: StoreMembershipType; // Select Single
  membership_status?: boolean; // Bool
  verified?: boolean; // Bool
  logo?: string; // File Single
  banner?: string; // File Single
  primaryColor?: string; // Text
  maps_url?: string; // Url
  expand?: {
    owner?: UserRecord;
    category?: CategoryRecord | CategoryRecord[];
    [key: string]: unknown;
  };
}

// ============================================================================
// 4. PRODUCTS COLLECTION (Type: Base)
// ============================================================================
export interface ProductRecord extends BaseRecord {
  store: string; // Relation -> stores (Nonempty)
  name: string; // Text (Nonempty)
  description?: string; // Text/Editor
  condition: ProductCondition; // Select Single (Nonempty)
  original_price?: number; // Number (original_price en USDT decimales o centavos)
  price: number; // Number (Nonzero)
  on_sale?: boolean; // Bool
  sale_ends_at?: string; // Date
  stock?: "available" | "out_of_stock" | string; // Select Single
  brand?: string; // Text
  listed?: boolean; // Bool
  images?: string[]; // File Multiple
  category: string; // Relation -> categories (Nonempty)
  tags?: string[] | Record<string, unknown>; // JSON
  expand?: {
    store?: StoreRecord;
    category?: CategoryRecord;
    [key: string]: unknown;
  };
}

// ============================================================================
// INPUT DTOs & QUERY OPTIONS - PRODUCTS
// ============================================================================
export interface ProductInput {
  storeId: string;
  name: string;
  description?: string;
  condition: ProductCondition;
  originalPrice?: number;
  original_price?: number; // Compatibilidad camelCase / snake_case
  price: number;
  onSale?: boolean;
  saleEndsAt?: string;
  stock?: "available" | "out_of_stock" | string;
  brand?: string;
  listed?: boolean;
  category: string;
  tags?: string[];
  newImages?: File[];
  imagesToDelete?: string[];
}

export interface GetProductsOptions {
  page?: number;
  perPage?: number;
  storeId?: string;
  categoryId?: string;
  searchTerm?: string;
  onlyListed?: boolean;
}

// ============================================================================
// INPUT DTOs & QUERY OPTIONS - STORES
// ============================================================================
export interface StoreInput {
  ownerId?: string;
  name?: string;
  slug?: string;
  instagram?: string;
  whatsapp?: string;
  correo?: string;
  category?: string | string[];
  description?: string;
  location?: string;
  status?: StoreStatus;
  membershipType?: StoreMembershipType;
  membershipStatus?: boolean;
  verified?: boolean;
  primaryColor?: string;
  mapsUrl?: string;
  logoFile?: File;
  bannerFile?: File;
  deleteLogo?: boolean;
  deleteBanner?: boolean;
}

export interface GetStoresOptions {
  page?: number;
  perPage?: number;
  ownerId?: string;
  status?: StoreStatus;
  searchTerm?: string;
  verifiedOnly?: boolean;
}

// ============================================================================
// INPUT DTOs & QUERY OPTIONS - CONTACT
// ============================================================================
export interface ContactTicket {
  id: string;
  user: string;
  name: string;
  reason: string;
  message: string;
  active: boolean;
  created: string;
  updated: string;
}
