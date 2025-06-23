"use client";

import Link from "next/link";
import { Building2, Mail, Phone } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="text-lg font-bold">JobPortal</span>
            </div>
            <p className="text-gray-400 text-sm">
              Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối nhà tuyển dụng và
              ứng viên.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Dành cho ứng viên</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tạo CV
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tính lương Gross-Net
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tìm hồ sơ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Báo cáo thị trường
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                contact@jobportal.vn
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                (028) 1234 5678
              </div>
            </div>
          </div>
        </div>
        <div className="my-8 h-px bg-gray-800" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 JobPortal. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-white">
              Bảo mật
            </Link>
            <Link href="#" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
