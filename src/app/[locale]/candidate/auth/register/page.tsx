"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";
import { RoleEnum } from "@/types/User";
type FormValues = {
  fullName: string;
  email: string;
  password: string;
  isRecruiter: boolean;
};

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.isRecruiter ? RoleEnum.RECRUITER : RoleEnum.CANDIDATE,
    };

    try {
      await registerUser(payload); // ✅ payload đúng kiểu RegisterRequest
    } catch {
      setError("root", {
        message: "Email đã được sử dụng hoặc có lỗi xảy ra",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Đăng ký tài khoản IT Jobs
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "Họ tên không được để trống",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email không được để trống" })}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Mật khẩu không được để trống",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRecruiter"
              {...register("isRecruiter")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isRecruiter"
              className="ml-2 block text-sm text-gray-700"
            >
              Tôi là nhà tuyển dụng
            </label>
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm text-center">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Bạn đã có tài khoản?{" "}
          <Link
            href="/candidate/auth/login"
            className="text-blue-500 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
