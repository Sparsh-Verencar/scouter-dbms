"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function JobHistoryAdmin() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // UI state
  const [q, setQ] = useState("");
  const [opFilter, setOpFilter] = useState("all"); // all / UPDATE / INSERT / DELETE
  const [expanded, setExpanded] = useState({}); // { [history_id]: boolean }

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/jobs/history?limit=500`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Invalid response");

      setRows(json.data || []);
      setSummary(json.summary || null);
      setErr(null);
    } catch (e) {
      console.error("fetchHistory error", e);
      setErr(e.message || "Failed to fetch job history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    const id = setInterval(fetchHistory, 10000); // poll every 10s
    return () => clearInterval(id);
  }, [fetchHistory]);

  // parse JSON helper
  const parseJSON = (val) => {
    if (!val && val !== 0) return null;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  // Compute diffs and build headline
  const rowsWithDiffs = useMemo(() => {
    return (rows || []).map((r) => {
      const oldRow = parseJSON(r.old_row);
      const newRow = parseJSON(r.new_row);
      const diffs = computeDiffs(oldRow, newRow);

      let headline = "";
      const op = String(r.operation || "").toUpperCase();

      if (op === "INSERT") {
        const title = newRow?.title || `Job #${r.job_id}`;
        const loc = newRow?.location || "";
        headline = `Created job: ${title}${loc ? ` (${loc})` : ""}`;
      } else if (op === "UPDATE") {
        const first = diffs[0];
        if (first) {
          headline = `Updated ${formatKey(first.key)} → ${first.newVal || "—"}`;
        } else {
          headline = "Updated job details";
        }
      } else if (op === "DELETE") {
        const title = oldRow?.title || `Job #${r.job_id}`;
        headline = `Deleted job: ${title}`;
      } else {
        headline = "Job change";
      }

      return { ...r, _old: oldRow, _new: newRow, _diffs: diffs, _headline: headline };
    });
  }, [rows]);

  // Filters + search
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return rowsWithDiffs.filter((r) => {
      if (opFilter !== "all" && String(r.operation).toLowerCase() !== opFilter.toLowerCase())
        return false;
      if (!qLower) return true;
      if (String(r.job_id).includes(qLower) || String(r.history_id).includes(qLower)) return true;
      if ((r.changed_by || "").toLowerCase().includes(qLower)) return true;
      for (const d of r._diffs || []) {
        if (d.key.toLowerCase().includes(qLower)) return true;
        if ((d.oldVal || "").toLowerCase().includes(qLower)) return true;
        if ((d.newVal || "").toLowerCase().includes(qLower)) return true;
      }
      return false;
    });
  }, [rowsWithDiffs, q, opFilter]);

  // unique operations for filter dropdown
  const ops = useMemo(() => {
    const set = new Set(rows.map((r) => r.operation).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rows]);

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      {/* Top header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: summary column */}
        <div className="lg:w-72">
          <div className="mb-4">
            <h2 className="text-2xl font-bold underline underline-offset-5">Overview</h2>
          </div>

          <div className="space-y-3">
            <SummaryCard label="Total Jobs" value={summary?.total_jobs} />
            <SummaryCard label="Open Jobs" value={summary?.open_jobs} accent="amber" />
            <SummaryCard label="Ongoing" value={summary?.ongoing_jobs} accent="blue" />
            <SummaryCard label="Completed" value={summary?.completed_jobs} accent="green" />
            <SummaryCard label="Recruiters" value={summary?.total_recruiters} accent="indigo" />
            <SummaryCard label="Freelancers" value={summary?.total_freelancers} accent="purple" />
          </div>

          <div className="mt-4 text-sm text-gray-400">
            <div>
              Records shown: <strong>{filtered.length}</strong>
            </div>
            <div className="mt-1">
              Last refresh: <strong>{loading ? "…" : new Date().toLocaleTimeString()}</strong>
            </div>
          </div>
        </div>

        {/* Right: main area */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <select
                value={opFilter}
                onChange={(e) => setOpFilter(e.target.value)}
                className="rounded-md px-3 py-2 border border-gray-700 bg-transparent text-sm"
              >
                {ops.map((o) => (
                  <option key={o} value={o}>
                    {String(o).toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400 mr-2">
                {loading ? "Refreshing…" : `${rows.length} history rows (server)`}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0b0b0d] to-[#0f0f12] border border-gray-800 shadow-sm overflow-hidden">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-transparent z-10">
                <TableRow>
                  <TableHead className="w-[80px] text-sm text-gray-300">ID</TableHead>
                  <TableHead className="text-sm text-gray-300">Job ID</TableHead>
                  <TableHead className="text-sm text-gray-300">Op</TableHead>
                  <TableHead className="text-sm text-gray-300">Changed</TableHead>
                  <TableHead className="text-sm text-gray-300">Summary</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-6 text-gray-500">
                      No history found
                    </TableCell>
                  </TableRow>
                ) : null}

                {filtered.map((r, idx) => {
                  const isOpen = !!expanded[r.history_id];
                  const diffs = r._diffs || [];
                  const shown = diffs.slice(0, 3);
                  const remaining = Math.max(0, diffs.length - shown.length);

                  return (
                    <TableRow
                      key={r.history_id}
                      className={`${
                        idx % 2 === 0 ? "bg-[#0f0f11]" : "bg-[#0b0b0d]"
                      } hover:bg-[#141418]`}
                    >
                      <TableCell className="py-3 align-top">
                        <div className="text-sm font-medium text-gray-200">{r.history_id}</div>
                        <div className="text-xs text-gray-500 mt-1">{r.changed_by || "—"}</div>
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="text-sm text-gray-300">{r.job_id}</div>
                        <div className="text-xs text-gray-500 mt-1">#{r.job_id}</div>
                      </TableCell>

                      <TableCell className="align-top">
                        <OpBadge op={r.operation} />
                      </TableCell>

                      <TableCell className="align-top text-sm text-gray-400">
                        {new Date(r.changed_at).toLocaleString()}
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="flex flex-col gap-2">
                          {/* HEADLINE from trigger */}
                          <div className="text-sm font-semibold text-gray-100">
                            {r._headline}
                          </div>

                          {/* inline compact diffs */}
                          {shown.length === 0 ? (
                            <div className="text-sm text-gray-400 italic">
                              No visible field-level changes
                            </div>
                          ) : (
                            shown.map((d) => (
                              <div
                                key={d.key}
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="text-sm text-gray-300 font-medium min-w-[140px]">
                                  {formatKey(d.key)}
                                </div>
                                <div className="flex-1 text-sm text-gray-200 flex gap-3">
                                  <div className="text-xs text-gray-400 w-1/2 truncate">
                                    {d.oldVal || "—"}
                                  </div>
                                  <div className="text-xs text-green-300 w-1/2 text-right truncate">
                                    {d.newVal || "—"}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          {/* +N more or expand button */}
                          <div className="flex items-center justify-between">
                            {remaining > 0 && !isOpen && (
                              <div className="text-xs text-gray-400">{`+${remaining} more`}</div>
                            )}

                            <div className="ml-auto">
                              <button
                                onClick={() =>
                                  setExpanded((prev) => ({
                                    ...prev,
                                    [r.history_id]: !prev[r.history_id],
                                  }))
                                }
                                className="text-xs text-indigo-300 hover:underline"
                              >
                                {isOpen ? "Hide" : "Details"}
                              </button>
                            </div>
                          </div>

                          {/* Expanded full details */}
                          {isOpen && (
                            <div className="mt-3 bg-black/30 border border-gray-800 rounded-lg p-3">
                              {diffs.length === 0 ? (
                                <div className="text-sm text-gray-400 italic">
                                  No visible changes
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {diffs.map((d) => (
                                    <div
                                      key={d.key}
                                      className="p-2 border-b border-gray-800 last:border-b-0"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-[160px] text-sm text-gray-300 font-semibold">
                                          {formatKey(d.key)}
                                        </div>
                                        <div className="flex-1 text-sm text-gray-200">
                                          <div className="text-xs text-gray-400">OLD</div>
                                          <div className="text-sm text-gray-200">
                                            {d.oldVal || (
                                              <span className="italic text-gray-500">—</span>
                                            )}
                                          </div>

                                          <div className="text-xs text-gray-400 mt-2">NEW</div>
                                          <div className="text-sm text-green-200">
                                            {d.newVal || (
                                              <span className="italic text-gray-500">—</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
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

          {/* error */}
          {err && <div className="mt-3 text-red-400">{err}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- small UI subcomponents & helpers ---------- */

function SummaryCard({ label, value = 0, accent = "gray" }) {
  const accentMap = {
    gray: "bg-gray-800 text-gray-200",
    amber: "bg-amber-900 text-amber-300",
    blue: "bg-blue-900 text-blue-300",
    green: "bg-green-900 text-green-300",
    indigo: "bg-indigo-900 text-indigo-300",
    purple: "bg-purple-900 text-purple-300",
  };
  return (
    <div
      className={`rounded-lg p-3 flex items-center justify-between ${
        accentMap[accent] || accentMap.gray
      } border border-gray-700`}
    >
      <div>
        <div className="text-xs text-gray-300">{label}</div>
        <div className="text-xl font-bold mt-1">{value ?? 0}</div>
      </div>
    </div>
  );
}

function OpBadge({ op }) {
  const opText = String(op || "").toUpperCase();
  const map = {
    UPDATE: "bg-yellow-800 text-yellow-300",
    INSERT: "bg-green-800 text-green-200",
    DELETE: "bg-red-800 text-red-300",
  };
  const cls = map[opText] || "bg-slate-800 text-slate-300";
  return (
    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {opText || "?"}
    </div>
  );
}

/** Return array of diffs: [{ key, oldVal, newVal }] */
function computeDiffs(oldRow, newRow) {
  if ((oldRow === null || oldRow === undefined) && (newRow === null || newRow === undefined))
    return [];

  const isPrimitive = (v) =>
    v === null || v === undefined || typeof v === "string" || typeof v === "number" || typeof v === "boolean";

  if (isPrimitive(oldRow) || isPrimitive(newRow)) {
    const oldStr = normalizePrimitive(oldRow);
    const newStr = normalizePrimitive(newRow);
    if (oldStr === newStr) return [];
    return [{ key: "value", oldVal: oldStr, newVal: newStr }];
  }

  const keys = Array.from(
    new Set([...(Object.keys(oldRow || {})), ...(Object.keys(newRow || {}))])
  );
  const diffs = keys.reduce((acc, key) => {
    const a = oldRow ? oldRow[key] : undefined;
    const b = newRow ? newRow[key] : undefined;
    const aStr = normalizePrimitive(a);
    const bStr = normalizePrimitive(b);
    if (aStr !== bStr) {
      acc.push({ key, oldVal: aStr, newVal: bStr });
    }
    return acc;
  }, []);

  // sort diffs: show more user-facing fields first (title, status, salary)
  diffs.sort((x, y) => {
    const priority = ["title", "status", "salary", "location", "category"];
    const xi = priority.indexOf(x.key) >= 0 ? priority.indexOf(x.key) : 99;
    const yi = priority.indexOf(y.key) >= 0 ? priority.indexOf(y.key) : 99;
    return xi - yi;
  });

  return diffs;
}

function normalizePrimitive(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    // Flatten objects into plain text instead of JSON
    try {
      const parts = Object.entries(v).map(([k, val]) => `${k}: ${String(val)}`);
      return parts.join("; ");
    } catch {
      return String(v);
    }
  }
  return String(v);
}

function formatKey(k) {
  if (k === "value") return "Value";
  const spaced = k.replace(/[_\-]/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.replace(/\b\w/g, (ch) => ch.toUpperCase());
}
