"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "@/firebaseConfig";

export default function MFAVerifyPage() {
  const { user, profile, verifyMfaSession } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const functions = getFunctions();
      const verifyMfaSms = httpsCallable(functions, "verifyMfaSms");
      await verifyMfaSms({ code });

      // Set the session flag
      verifyMfaSession();

      // Redirect to home dashboard
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!profile?.phoneNumber) {
      setError("No phone number found to resend the code.");
      return;
    }
    setResending(true);
    setError("");
    setMessage("");

    try {
      const functions = getFunctions();
      const sendMfaSms = httpsCallable(functions, "sendMfaSms");
      await sendMfaSms({ phoneNumber: profile.phoneNumber });
      setMessage("A new code has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify Your Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please enter the 6-digit code we sent to your phone number{" "}
              {profile?.phoneNumber ? `ending in ${profile.phoneNumber.slice(-4)}` : ""}.
            </p>
          </div>
          <form onSubmit={handleVerify}>
            <div className="space-y-6">
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              {message && <div className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg border border-green-200">{message}</div>}
              <div>
                <Label>
                  Verification Code <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full" size="sm" disabled={loading} type="submit">
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || loading}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
                >
                  {resending ? "Resending..." : "Didn't receive a code? Resend"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
