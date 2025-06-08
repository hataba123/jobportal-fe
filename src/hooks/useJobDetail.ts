// // 📁 src/hooks/useJobDetail.ts
// import { useEffect, useState } from "react";
// import { getJobDetail } from "@/lib/api/jobs";

// export function useJobDetail(id) {
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     getJobDetail(id).then(setJob).finally(() => setLoading(false));
//   }, [id]);

//   return { job, loading };
// }
