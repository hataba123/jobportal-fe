"use client";

import Link from "next/link";
import { JobPost } from "@/types/job-post";

// Hiển thị một ô job đơn lẻ
export default function JobCard({
  id,
  title,
  location,
  createdAt,
  salary,
  employer,
}: JobPost) {
  return (
    <Link
      href={`/jobs/${id}`}
      className="block border border-gray-200 hover:border-gray-350 active:border-gray-350 p-4 rounded-xl hover:shadow transition-all duration-200 bg-white"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">
          {employer?.fullName || "Unknown Company"}{" "}
          {location && `• ${location}`}
        </p>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(salary)}
          </span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
