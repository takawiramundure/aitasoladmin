"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { getFunctions, httpsCallable } from "firebase/functions";
import Alert from "@/components/ui/alert/Alert";

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
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-boxdark rounded-2xl border border-stroke dark:border-strokedark shadow-default p-8 space-y-8 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <div>
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-bold text-title-md text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Security Verification
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please enter the 6-digit code sent to your phone number{" "}
              {profile?.phoneNumber ? `ending in ${profile.phoneNumber.slice(-4)}` : ""}.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {error && <Alert variant="error" title="Verification Failed" message={error} />}
            {message && <Alert variant="success" title="Code Dispatched" message={message} />}

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Verification Code <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-xl font-bold tracking-[0.5em] h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button className="w-full h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading} type="submit">
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || loading}
                className="text-xs font-semibold text-primary hover:underline transition-all disabled:opacity-50 mt-1"
              >
                {resending ? "Resending Code..." : "Didn't receive a code? Resend"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
