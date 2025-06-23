"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Giả sử Job có id, title, status
type Job = {
  id: string;
  title: string;
  status: string;
};

export default function JobsListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // TODO: Fetch jobs của recruiter từ API backend
    // Dùng mock data tạm:
    setJobs([
      { id: "1", title: "Frontend Developer", status: "Open" },
      { id: "2", title: "Backend Developer", status: "Closed" },
      { id: "3", title: "Fullstack Developer", status: "Open" },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Jobs You Posted</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-100">
              <td className="border p-2">{job.title}</td>
              <td className="border p-2">{job.status}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/recruiter/jobs/${job.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/recruiter/jobs/${job.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => alert(`Delete job ${job.id} here`)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                No jobs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
