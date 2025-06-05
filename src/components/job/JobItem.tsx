"use client";

import Link from "next/link";

interface JobItemProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

// Hiển thị một ô job đơn lẻ
export default function JobItem({
  id,
  title,
  company,
  location,
  type,
  postedAt,
}: JobItemProps) {
  return (
    <Link
      href={`/jobs/${id}`} // Điều hướng đến trang chi tiết job
      className="block border p-4 rounded-xl hover:shadow transition bg-white"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">
          {company} • {location}
        </p>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{type}</span>
          <span>{postedAt}</span>
        </div>
      </div>
    </Link>
  );
}
