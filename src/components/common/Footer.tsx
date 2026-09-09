"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import BrandLogo from "@/components/common/BrandLogo";
import { Mail, Phone, MapPin, Send, ArrowRight, Github, Linkedin, Facebook } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      toast.success("Cảm ơn bạn đã đăng ký nhận bản tin việc làm!");
      setEmail("");
      setSubscribing(false);
    }, 600);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      {/* Top Section / Newsletter CTA */}
      <div className="border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Nhận cơ hội việc làm IT mới nhất mỗi tuần
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-lg">
                Đăng ký bản tin để nhận thông tin về các vị trí tuyển dụng lương cao, xu hướng công nghệ và cẩm nang phỏng vấn.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md lg:ml-auto w-full">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 shadow-xs shadow-blue-500/20"
              >
                <span>{subscribing ? "Đang gửi..." : "Đăng ký"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo href="/" size="md" variant="dark" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng kết nối nhân tài công nghệ và doanh nghiệp hàng đầu tại Việt Nam. Tìm kiếm việc làm mơ ước với trải nghiệm tuyển dụng minh bạch, nhanh chóng.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>support@jobportal.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>+84 (028) 3888 9999</span>
              </div>
            </div>
          </div>

          {/* Candidates Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ứng viên</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/candidate/job" className="hover:text-white transition-colors">
                  Tìm việc làm IT
                </Link>
              </li>
              <li>
                <Link href="/candidate/company" className="hover:text-white transition-colors">
                  Khám phá công ty
                </Link>
              </li>
              <li>
                <Link href="/candidate/userprofiles/profile" className="hover:text-white transition-colors">
                  Quản lý CV & Hồ sơ
                </Link>
              </li>
              <li>
                <Link href="/candidate/userprofiles/matches" className="hover:text-white transition-colors">
                  Việc làm gợi ý AI
                </Link>
              </li>
              <li>
                <Link href="/candidate/blog" className="hover:text-white transition-colors">
                  Bí quyết phỏng vấn
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Nhà tuyển dụng</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/recruiter/jobs" className="hover:text-white transition-colors">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/recruiter/candidates" className="hover:text-white transition-colors">
                  Tìm hồ sơ ứng viên
                </Link>
              </li>
              <li>
                <Link href="/recruiter/plans" className="hover:text-white transition-colors">
                  Bảng giá & Gói dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/recruiter/company" className="hover:text-white transition-colors">
                  Xây dựng thương hiệu
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-white transition-colors">
                  Recruiter Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Hot Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ngành nghề hot</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/candidate/job?category=Frontend" className="hover:text-white transition-colors">
                  Frontend Developer
                </Link>
              </li>
              <li>
                <Link href="/candidate/job?category=Backend" className="hover:text-white transition-colors">
                  Backend Developer
                </Link>
              </li>
              <li>
                <Link href="/candidate/job?category=Fullstack" className="hover:text-white transition-colors">
                  Fullstack Engineer
                </Link>
              </li>
              <li>
                <Link href="/candidate/job?category=DevOps" className="hover:text-white transition-colors">
                  DevOps / Cloud
                </Link>
              </li>
              <li>
                <Link href="/candidate/job?category=AI" className="hover:text-white transition-colors">
                  AI / Data Scientist
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobPortal. Bản quyền thuộc về JobPortal Platform.</p>
          <div className="flex items-center space-x-6">
            <Link href="/candidate/blog" className="hover:text-slate-400 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/candidate/blog" className="hover:text-slate-400 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="/candidate/blog" className="hover:text-slate-400 transition-colors">
              Quy chế hoạt động
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
