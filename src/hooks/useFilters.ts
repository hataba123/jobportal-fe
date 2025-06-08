// // 📁 src/hooks/useFilters.ts
// import { useState } from "react";

// export function useFilters(defaultFilters = {}) {
//   const [filters, setFilters] = useState(defaultFilters);

//   const setFilter = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const resetFilters = () => setFilters(defaultFilters);

//   return { filters, setFilter, resetFilters };
// }
