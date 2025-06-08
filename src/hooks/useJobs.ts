// // 📁 src/hooks/useJobs.ts
// import { useEffect, useState } from "react";
// import { getJobs } from "@/lib/api/jobs";

// export function useJobs(query = {}) {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getJobs(query)
//       .then(setJobs)
//       .catch(setError)
//       .finally(() => setLoading(false));
//   }, [JSON.stringify(query)]);

//   return { jobs, loading, error };
// }
