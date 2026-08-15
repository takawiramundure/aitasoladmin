"use client";

import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/components/ui/alert/Alert";
import { collection, query, orderBy, limit, getDocs, getFirestore } from "firebase/firestore";

interface AuditLog {
  id: string;
  timestamp?: any;
  userId: string;
  userEmail: string;
  action: string;
  details?: any;
  realRole: string;
  activeRole: string;
}

interface ResendEmailLog {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  status: string;
}

export default function AuditLogsPage() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [resendLogs, setResendLogs] = useState<ResendEmailLog[]>([]);
  const [activeTab, setActiveTab] = useState<"system" | "resend">("system");
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  const isSuperAdmin = profile?.role === "super_admin";

  useEffect(() => {
    if (isSuperAdmin) {
      if (activeTab === "system") {
        fetchLogs();
      } else {
        fetchResendLogs();
      }
    }
  }, [isSuperAdmin, activeTab]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const dbInstance = getFirestore();
      const logsQuery = query(
        collection(dbInstance, "audit_logs"),
        orderBy("timestamp", "desc"),
        limit(100)
      );
      const querySnapshot = await getDocs(logsQuery);
      const fetchedLogs: AuditLog[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedLogs.push({
          id: doc.id,
          ...data,
        } as AuditLog);
      });
      setLogs(fetchedLogs);
    } catch (err: any) {
      console.error("Error fetching audit logs:", err);
      setError(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResendLogs = async () => {
    setResendLoading(true);
    setError("");
    try {
      const { getFunctions, httpsCallable } = await import("firebase/functions");
      const getLogs = httpsCallable(getFunctions(), "getResendEmailLogs");
      const res: any = await getLogs();
      if (res.data && res.data.success) {
        setResendLogs(res.data.emails || []);
      } else {
        throw new Error(res.data.message || "Could not retrieve Resend emails");
      }
    } catch (err: any) {
      console.error("Error fetching Resend logs:", err);
      setError(err.message || "Failed to load outbound Resend logs.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <Alert variant="error" title="Access Denied" message="Only Super Admins can access backend system audit logs." />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="System Audit Logs | Digital Maples Labs CMS"
        description="Monitor system configuration operations, impersonations, and password resets"
      />
      <PageBreadcrumb pageTitle="System Audit Logs" />

      <div className="mx-auto max-w-270 space-y-6">
        {error && <Alert variant="error" title="Error" message={error} />}

        {/* Tab Switcher */}
        <div className="flex border-b border-stroke dark:border-strokedark gap-4 mb-4">
          <button
            onClick={() => setActiveTab("system")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "system"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            System Operations
          </button>
          <button
            onClick={() => setActiveTab("resend")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "resend"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            Outbound Email Traffic (Resend)
          </button>
        </div>

        {activeTab === "system" ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white">
                Recent System Events (Max 100)
              </h3>
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="text-xs text-primary hover:underline font-semibold"
              >
                {loading ? "Refreshing..." : "Refresh Logs"}
              </button>
            </div>
            <div className="p-7">
              {loading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading audit logs...</div>
              ) : logs.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No events logged yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Operator</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke dark:divide-strokedark">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-meta-4/5">
                          <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : "Pending..."}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium text-black dark:text-white">{log.userEmail || "Anonymous"}</span>
                              <span className="text-[10px] text-gray-400">
                                ID: {log.userId} | Role: {log.realRole || "None"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              log.action.includes("reset") ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                              log.action.includes("domain_add") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                              log.action.includes("domain_remove") ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
                              "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-mono text-gray-600 dark:text-gray-400 break-all whitespace-pre-wrap max-w-md">
                            {log.details ? JSON.stringify(log.details, null, 2) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white">
                Resend Outbound Delivery Traffic
              </h3>
              <button
                onClick={fetchResendLogs}
                disabled={resendLoading}
                className="text-xs text-primary hover:underline font-semibold"
              >
                {resendLoading ? "Refreshing..." : "Refresh Outbound Status"}
              </button>
            </div>
            <div className="p-7">
              {resendLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Fetching outbound Resend log telemetry...</div>
              ) : resendLogs.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No outbound traffic logged.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Sent At</th>
                        <th className="py-3 px-4">Recipient</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Message ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke dark:divide-strokedark">
                      {resendLogs.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-meta-4/5">
                          <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-medium text-black dark:text-white">
                              {item.to.join(", ")}
                            </span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-xs">
                            {item.subject}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 in-py-0.5 text-xs font-medium ${
                              item.status === "sent" || item.status === "delivered" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                              item.status === "bounced" || item.status === "failed" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
                              "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            }`}>
                              {item.status || "sent"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                            {item.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
