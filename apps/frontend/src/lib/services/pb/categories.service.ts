import pb from "@/lib/pocketbase";
import type { CategoryRecord } from "@/lib/types/pocketbase";

export const CategoriesService = {
  /**
   * Obtiene ÚNICAMENTE las categorías que tienen al menos un producto activo asociado.
   * Utiliza la relación inversa de PocketBase para garantizar Categorías Dinámicas.
   */
  async getActiveCategories(): Promise<CategoryRecord[]> {
    try {
      return await pb.collection("categories").getFullList<CategoryRecord>({
        filter: "products_via_category.id != null", // Muestra solo categorías con productos
        sort: "name",
      });
    } catch (error) {
      console.error("Error al obtener categorías activas:", error);
      throw error;
    }
  },

  /**
   * Obtiene TODAS las categorías registradas en la base de datos.
   * Ideal para formularios (al crear/editar producto).
   */
  async getAllCategories(): Promise<CategoryRecord[]> {
    try {
      return await pb.collection("categories").getFullList<CategoryRecord>({
        sort: "name",
      });
    } catch (error) {
      console.error("Error al obtener todas las categorías:", error);
      throw error;
    }
  },

  /**
   * Obtiene una categoría específica buscando por su slug.
   */
  async getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
    try {
      return await pb
        .collection("categories")
        .getFirstListItem<CategoryRecord>(`slug = "${slug}"`);
    } catch (error: any) {
      // En PocketBase, si no encuentra el registro lanza un error 404
      if (error?.status === 404) {
        return null;
      }
      console.error(`Error al obtener la categoría por slug (${slug}):`, error);
      throw error;
    }
  },
};
