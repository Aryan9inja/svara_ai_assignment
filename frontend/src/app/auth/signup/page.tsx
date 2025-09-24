"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthSchema as schema } from "@/lib/validators";
import { useAuth } from "@/contexts/AuthContext";
import { PublicRoute } from "@/components/auth/RouteGuards";

type SignupData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupData>({
    resolver: zodResolver(schema),
  });

  const emailValue = watch("email") || "";
  const passwordValue = watch("password") || "";

  const onSubmit = async (data: SignupData) => {
    setLoading(true);
    setError("");
    try {
      await signUp(data.email, data.password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-200">
          <h1 className="mb-8 text-center text-3xl font-extrabold text-blue-700 tracking-tight">Create Your Account</h1>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-700 animate-shake">
              <svg aria-hidden="true" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  onChange: (e) => setValue("email", e.target.value),
                })}
                error={errors.email?.message}
                value={emailValue}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  onChange: (e) => setValue("password", e.target.value),
                })}
                error={errors.password?.message}
                value={passwordValue}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                  Signing up...
                </span>
              ) : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 hover:underline transition-colors duration-150">
              Log in
            </a>
          </p>
        </div>
      </div>
    </PublicRoute>
  );
}