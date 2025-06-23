"use client";

import React from "react";
import Link from "next/link";

// Dữ liệu cứng (mock)
const mockJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    location: "Hà Nội",
    description:
      "We are looking for a skilled React developer to build beautiful interfaces.",
    createdAt: "2025-06-10",
  },
  {
    id: "2",
    title: "Backend Developer",
    location: "TP.HCM",
    description:
      "Join our backend team to design robust APIs using Spring Boot.",
    createdAt: "2025-06-12",
  },
];

export default function RecruiterJobsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Posted Jobs</h2>
        <Link
          href="/recruiter/create-job"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Job
        </Link>
      </div>

      {/* Job List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.location}</p>
            <p className="text-sm line-clamp-3 my-2">{job.description}</p>
            <div className="flex justify-between mt-3 text-sm text-gray-600">
              <Link
                href={`/recruiter/jobs/${job.id}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
              <Link
                href={`/recruiter/jobs/edit/${job.id}`}
                className="text-green-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => alert("Delete logic here")}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
