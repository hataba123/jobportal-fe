"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";
import { LoginRequest } from "@/types/LoginRequest";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
    } catch {
      setError("root", {
        message: "Email hoặc mật khẩu không đúng",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Chào mừng bạn đến với IT Jobs
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="my-6">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  console.log("Attempting Google OAuth sign in...");
                  const result = await signIn("google", { 
                    callbackUrl: "/candidate",
                    redirect: false 
                  });
                  console.log("Google OAuth result:", result);
                  
                  if (result?.error) {
                    console.error("Google OAuth error:", result.error);
                    alert(`Google OAuth error: ${result.error}`);
                  } else if (result?.url) {
                    window.location.href = result.url;
                  }
                } catch (error) {
                  console.error("Google OAuth exception:", error);
                  alert(`Google OAuth exception: ${error}`);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.36 13.13 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28a14.5 14.5 0 0 1 0-8.56l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.6c-2.01 1.35-4.59 2.15-7.95 2.15-6.27 0-11.64-3.63-13.33-8.72l-7.98 6.19C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Đăng nhập với Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  console.log("Attempting Facebook OAuth sign in...");
                  const result = await signIn("facebook", { 
                    callbackUrl: "/candidate",
                    redirect: false 
                  });
                  console.log("Facebook OAuth result:", result);
                  
                  if (result?.error) {
                    console.error("Facebook OAuth error:", result.error);
                    alert(`Facebook OAuth error: ${result.error}`);
                  } else if (result?.url) {
                    window.location.href = result.url;
                  }
                } catch (error) {
                  console.error("Facebook OAuth exception:", error);
                  alert(`Facebook OAuth exception: ${error}`);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 32 32" className="inline-block"><path fill="#1877F3" d="M32 16c0-8.837-7.163-16-16-16S0 7.163 0 16c0 7.982 5.84 14.584 13.438 15.854v-11.22H9.398v-4.634h4.04V12.41c0-3.993 2.393-6.197 6.065-6.197 1.754 0 3.584.312 3.584.312v3.953h-2.019c-1.989 0-2.611 1.236-2.611 2.504v3.01h4.437l-.71 4.634h-3.727v11.22C26.16 30.584 32 23.982 32 16z"/><path fill="#FFF" d="M22.69 20.634l.71-4.634h-4.437v-3.01c0-1.268.622-2.504 2.611-2.504h2.019V6.525s-1.83-.312-3.584-.312c-3.672 0-6.065 2.204-6.065 6.197v3.22h-4.04v4.634h4.04v11.22a16.06 16.06 0 0 0 2.563.215c.872 0 1.726-.074 2.563-.215v-11.22h3.727z"/></svg>
              Đăng nhập với Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  console.log("Attempting GitHub OAuth sign in...");
                  const result = await signIn("github", { 
                    callbackUrl: "/candidate",
                    redirect: false 
                  });
                  console.log("GitHub OAuth result:", result);
                  
                  if (result?.error) {
                    console.error("GitHub OAuth error:", result.error);
                    alert(`GitHub OAuth error: ${result.error}`);
                  } else if (result?.url) {
                    window.location.href = result.url;
                  }
                } catch (error) {
                  console.error("GitHub OAuth exception:", error);
                  alert(`GitHub OAuth exception: ${error}`);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="inline-block"><path fill="#181717" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Đăng nhập với GitHub
            </Button>
          </div>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Bạn chưa có tài khoản?{" "}
          <Link
            href="/candidate/auth/register"
            className="text-blue-500 hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
