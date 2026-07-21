import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";

// Definimos la estructura de la categoría basada en tu colección de PocketBase
export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  created?: string;
  updated?: string;
  // Añade aquí otros campos si tu colección los tiene (ej: slug, icon, etc.)
}

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Especificamos el tipo <Category> en la petición de PocketBase
    pb.collection("categories")
      .getFullList<Category>()
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { categories, isLoading };
}
