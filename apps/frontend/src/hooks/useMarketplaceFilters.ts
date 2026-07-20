import { useReducer } from "react";

// 1. El estado inicial (Tipado implícito en TS)
const INITIAL_STATE = {
  searchTerm: "",
  activeCategory: "Todos",
  minPrice: "",
  maxPrice: "",
  filterCond: "all",
  filterLoc: "all",
  sortOrder: "",
  currentPage: 1,
};

// Definimos un tipo estricto para las acciones del reducer (Muy útil en TS)
type FilterAction =
  | { type: "SET_FILTER"; payload: { key: string; value: any } }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_ALL" };

// 2. El Reducer (Función pura, se queda afuera de la lógica del hook)
function filtersReducer(state: typeof INITIAL_STATE, action: FilterAction) {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        currentPage: 1,
      };
    case "SET_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "RESET_FILTERS":
      return {
        ...INITIAL_STATE,
        searchTerm: state.searchTerm,
      };
    case "RESET_ALL":
      return INITIAL_STATE;
    default:
      return state;
  }
}

// 3. LA CLAVE: Exportamos el Custom Hook (Tu contenedor de estado)
export function useMarketplaceFilters() {
  const [filterState, dispatch] = useReducer(filtersReducer, INITIAL_STATE);

  // Retornamos el estado y el dispatch para que la UI los use
  return {
    filterState,
    dispatch,
  };
}
