"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Candidate = {
  id: string;
  name: string;
  appliedJobTitle: string;
  status: string;
};

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // TODO: fetch data từ API backend
    setCandidates([
      {
        id: "a1",
        name: "Nguyễn Văn A",
        appliedJobTitle: "Frontend Developer",
        status: "Pending",
      },
      {
        id: "b2",
        name: "Trần Thị B",
        appliedJobTitle: "Backend Developer",
        status: "Interviewed",
      },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Candidates Applied</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Applied Job</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-gray-100">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.appliedJobTitle}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">
                <Link
                  href={`/recruiter/candidates/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center">
                No candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
