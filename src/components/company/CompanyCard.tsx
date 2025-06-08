<div className="rounded-xl border p-4 shadow bg-white">
  {/* Logo công ty */}
  <div className="flex justify-center">
    <img src="/logo.png" className="w-24 h-24 object-contain rounded-md" />
  </div>

  {/* Tên công ty */}
  <h3 className="text-lg font-semibold text-center mt-4">
    Tên công ty
  </h3>

  {/* Tech stack */}
  <div className="flex flex-wrap justify-center gap-2 mt-2">
    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Java</span>
    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">ReactJS</span>
    {/* ... */}
  </div>

  {/* Thông tin dưới cùng */}
  <div className="flex justify-between items-center mt-6 px-2 text-sm text-gray-700">
    <span>TP HCM</span>
    <span className="flex items-center gap-1 text-green-600 font-semibold">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      4 Việc làm
    </span>
  </div>
</div>
