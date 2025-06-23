"use client";
export default function DashboardPage() {
  return (
    <>
      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-3">Total Jobs</h2>
          <p className="text-3xl font-bold text-blue-700">152</p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-3">Total Candidates</h2>
          <p className="text-3xl font-bold text-blue-700">1,200</p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-3">New Applications</h2>
          <p className="text-3xl font-bold text-blue-700">38</p>
        </div>
      </section>

      {/* Recent job listings table */}
      <section className="mt-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Job Listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2">Job Title</th>
                <th className="py-2">Employer</th>
                <th className="py-2">Location</th>
                <th className="py-2">Date Posted</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-2">Frontend Developer</td>
                <td className="py-2">Tech Corp</td>
                <td className="py-2">New York, NY</td>
                <td className="py-2">2025-06-01</td>
                <td className="py-2 text-green-600 font-semibold">Active</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-2">Marketing Specialist</td>
                <td className="py-2">Creative Agency</td>
                <td className="py-2">San Francisco, CA</td>
                <td className="py-2">2025-05-28</td>
                <td className="py-2 text-yellow-600 font-semibold">Pending</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-2">Backend Engineer</td>
                <td className="py-2">Innovate Ltd.</td>
                <td className="py-2">Remote</td>
                <td className="py-2">2025-05-25</td>
                <td className="py-2 text-red-600 font-semibold">Expired</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
