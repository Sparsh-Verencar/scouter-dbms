"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function JobHistoryAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/jobs/history?limit=200`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Invalid response");
      setRows(json.data || []);
      setErr(null);
    } catch (e) {
      console.error("fetchHistory error", e);
      setErr(e.message || "Failed to fetch job history");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load + polling fallback
  useEffect(() => {
    fetchHistory();
    const id = setInterval(fetchHistory, 8000); // poll every 8s
    return () => clearInterval(id);
  }, [fetchHistory]);

  // parse old/new JSON safely for display
  const parseJSON = (val) => {
    if (!val) return null;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      // not JSON, return raw
      return val;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      {/* Header area */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Job History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent changes recorded by the job history trigger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-slate-800 to-slate-700 border border-gray-700 px-4 py-2 text-sm text-white shadow-sm hover:brightness-105 transition"
            type="button"
          >
            Refresh
          </button>
          <div className="text-sm text-gray-400">
            {loading ? "Loading…" : `${rows.length} records`}
          </div>
        </div>
      </div>

      {/* Card wrapper */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0b0b0d] to-[#0f0f12] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-transparent">
              <TableRow>
                <TableHead className="w-[90px] text-sm text-gray-300">ID</TableHead>
                <TableHead className="text-sm text-gray-300">Job ID</TableHead>
                <TableHead className="text-sm text-gray-300">Op</TableHead>
                <TableHead className="text-sm text-gray-300">Changed At</TableHead>
                <TableHead className="text-sm text-gray-300 text-right">Details</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-8 text-gray-500">
                    No history yet
                  </TableCell>
                </TableRow>
              ) : null}

              {rows.map((r, idx) => {
                const oldRow = parseJSON(r.old_row);
                const newRow = parseJSON(r.new_row);

                return (
                  <TableRow
                    key={r.history_id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-[#0f0f11]" : "bg-[#0b0b0d]"
                    } hover:bg-[#141418]`}
                  >
                    <TableCell className="font-medium text-gray-200 py-4">
                      {r.history_id}
                    </TableCell>
                    <TableCell className="text-gray-300">{r.job_id}</TableCell>
                    <TableCell className="text-indigo-300">{r.operation}</TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(r.changed_at).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right align-top max-w-[48rem] p-3">
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-full max-w-[48rem] text-left">
                          <div className="text-[11px] text-gray-400 mb-1">OLD</div>
                          <pre className="bg-black/50 border border-gray-800 rounded-lg p-3 text-[12px] text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-48">
                            {formatJSONForDisplay(oldRow)}
                          </pre>
                        </div>

                        <div className="w-full max-w-[48rem] text-left">
                          <div className="text-[11px] text-gray-400 mb-1">NEW</div>
                          <pre className="bg-black/60 border border-gray-700 rounded-lg p-3 text-[12px] text-green-200 overflow-x-auto whitespace-pre-wrap max-h-48">
                            {formatJSONForDisplay(newRow)}
                          </pre>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  End of history
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}

function formatJSONForDisplay(val) {
  if (!val && val !== 0) return "";
  if (typeof val === "string") {
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch {
      return val;
    }
  }
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}
