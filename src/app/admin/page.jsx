"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function JobHistoryAdmin() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [opFilter, setOpFilter] = useState("all"); // all / INSERT / UPDATE / DELETE
  const [expanded, setExpanded] = useState({}); // { [history_id]: boolean }

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(`${API}/api/jobs/history`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Invalid response");

      setRows(Array.isArray(json.data) ? json.data : []);
      setSummary(json.summary || null);
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

  // Helpers
  const parseJSONSafe = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return val; // fallback to raw string
    }
  };

  // Simplified diff computation: returns array [{ key, oldVal, newVal }]
  const computeDiffs = (oldRow, newRow) => {
    if (!oldRow && !newRow) return [];
    if (typeof oldRow !== "object" || typeof newRow !== "object") {
      const a = oldRow === undefined || oldRow === null ? "" : String(oldRow);
      const b = newRow === undefined || newRow === null ? "" : String(newRow);
      return a === b ? [] : [{ key: "value", oldVal: a, newVal: b }];
    }

    const keys = Array.from(new Set([...Object.keys(oldRow || {}), ...Object.keys(newRow || {})]));
    const diffs = keys.reduce((acc, k) => {
      const a = oldRow ? oldRow[k] : undefined;
      const b = newRow ? newRow[k] : undefined;
      const aS = a === undefined || a === null ? "" : String(a);
      const bS = b === undefined || b === null ? "" : String(b);
      if (aS !== bS) acc.push({ key: k, oldVal: aS, newVal: bS });
      return acc;
    }, []);

    // sort by priority (title/status first)
    const priority = ["title", "status", "salary", "location", "category"];
    diffs.sort((x, y) => {
      const xi = priority.indexOf(x.key) === -1 ? 99 : priority.indexOf(x.key);
      const yi = priority.indexOf(y.key) === -1 ? 99 : priority.indexOf(y.key);
      return xi - yi;
    });

    return diffs;
  };

  // Build rows with parsed JSON + diffs + headline
  const rowsWithMeta = useMemo(() => {
    return rows.map((r) => {
      const oldRow = parseJSONSafe(r.old_row);
      const newRow = parseJSONSafe(r.new_row);
      const diffs = computeDiffs(oldRow, newRow);

      const op = String(r.operation || "").toUpperCase();
      let headline = "Job change";
      if (op === "INSERT") {
        const title = (newRow && (newRow.title || newRow.name)) || `Job #${r.job_id || "?"}`;
        const loc = (newRow && newRow.location) || "";
        headline = `Created: ${title}${loc ? ` (${loc})` : ""}`;
      } else if (op === "UPDATE") {
        if (diffs.length) headline = `Updated ${formatKey(diffs[0].key)} → ${diffs[0].newVal || "—"}`;
        else headline = "Updated job details";
      } else if (op === "DELETE") {
        const title = (oldRow && (oldRow.title || oldRow.name)) || `Job #${r.job_id || "?"}`;
        headline = `Deleted: ${title}`;
      }

      return { ...r, _old: oldRow, _new: newRow, _diffs: diffs, _headline: headline, _op: op };
    });
  }, [rows]);

  // Filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rowsWithMeta.filter((r) => {
      if (opFilter !== "all" && (r._op || "").toLowerCase() !== opFilter.toLowerCase()) return false;
      if (!q) return true;

      // search in headline, changed_by, job_id, diffs
      if ((r._headline || "").toLowerCase().includes(q)) return true;
      if ((r.changed_by || "").toLowerCase().includes(q)) return true;
      if (String(r.job_id || "").includes(q)) return true;

      for (const d of r._diffs || []) {
        if ((d.key || "").toLowerCase().includes(q)) return true;
        if ((d.oldVal || "").toLowerCase().includes(q)) return true;
        if ((d.newVal || "").toLowerCase().includes(q)) return true;
      }

      return false;
    });
  }, [rowsWithMeta, query, opFilter]);

  // unique ops for dropdown
  const ops = useMemo(() => {
    const set = new Set(rowsWithMeta.map((r) => r._op).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rowsWithMeta]);

  // UI render
  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Summary */}
        <div className="lg:w-72">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="space-y-3">
            <SummaryCard label="Total Jobs" value={summary?.total_jobs ?? 0} />
            <SummaryCard label="Open" value={summary?.open_jobs ?? 0} accent="amber" />
            <SummaryCard label="Ongoing" value={summary?.ongoing_jobs ?? 0} accent="blue" />
            <SummaryCard label="Completed" value={summary?.completed_jobs ?? 0} accent="green" />
            <SummaryCard label="Recruiters" value={summary?.total_recruiters ?? 0} accent="indigo" />
            <SummaryCard label="Freelancers" value={summary?.total_freelancers ?? 0} accent="purple" />
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div>Records shown: <strong>{filtered.length}</strong></div>
            <div className="mt-1">Last refresh: <strong>{loading ? "…" : new Date().toLocaleTimeString()}</strong></div>
            {err && <div className="mt-2 text-red-400">Error: {err}</div>}
          </div>
        </div>

        {/* Right: Controls + Table */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex gap-3 w-full sm:w-auto items-center">
              <FilterDropdown value={opFilter} onChange={setOpFilter} ops={ops} />
              <SearchBox value={query} onChange={setQuery} />
            </div>

            <div className="text-sm text-gray-400">
              {loading ? "Refreshing…" : `${rows.length} history rows (server)`}
            </div>
          </div>

          <div className="bg-white/5 dark:bg-transparent border border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="w-full">
              <table className="min-w-full table-auto">
                <thead className="bg-neutral-900/30 sticky top-0">
                  <tr className="text-left text-sm text-gray-300">
                    <th className="p-3 w-16">ID</th>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Op</th>
                    <th className="p-3">Changed</th>
                    <th className="p-3">Summary</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">No history found</td>
                    </tr>
                  ) : null}

                  {filtered.map((r, i) => {
                    const isOpen = !!expanded[r.history_id];
                    const shown = (r._diffs || []).slice(0, 3);
                    const remaining = Math.max(0, (r._diffs || []).length - shown.length);

                    return (
                      <React.Fragment key={r.history_id || `${i}-${r.job_id}`}>
                        <tr
                          className={`border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer`}
                          onClick={() => setExpanded(prev => ({ ...prev, [r.history_id]: !prev[r.history_id] }))}
                        >
                          <td className="p-3 align-top text-sm text-gray-300">{r.history_id}</td>
                          <td className="p-3 align-top text-sm">
                            <div className="text-gray-200 font-medium">{r.job_id}</div>
                            <div className="text-xs text-gray-400 mt-1">#{r.job_id}</div>
                          </td>
                          <td className="p-3 align-top">
                            <OpBadge op={r._op} />
                          </td>
                          <td className="p-3 align-top text-sm text-gray-400">
                            {r.changed_at ? new Date(r.changed_at).toLocaleString() : "—"}
                          </td>
                          <td className="p-3 align-top">
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-semibold text-gray-100">{r._headline}</div>

                              {shown.length === 0 ? (
                                <div className="text-sm text-gray-400 italic">No visible field-level changes</div>
                              ) : (
                                shown.map(d => (
                                  <div key={d.key} className="flex items-center gap-3">
                                    <div className="min-w-[120px] text-sm text-gray-300 font-medium">{formatKey(d.key)}</div>
                                    <div className="flex-1 text-sm text-gray-200 flex gap-3">
                                      <div className="text-xs text-gray-400 w-1/2 truncate">{d.oldVal || "—"}</div>
                                      <div className="text-xs text-green-300 w-1/2 text-right truncate">{d.newVal || "—"}</div>
                                    </div>
                                  </div>
                                ))
                              )}

                              <div className="flex items-center justify-between">
                                {remaining > 0 && !isOpen && <div className="text-xs text-gray-400">{`+${remaining} more`}</div>}
                                <div className="ml-auto">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [r.history_id]: !prev[r.history_id] })); }}
                                    className="text-xs text-indigo-300 hover:underline"
                                  >
                                    {isOpen ? "Hide" : "Details"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr>
                            <td colSpan={5} className="bg-black/30 p-4">
                              <DiffDetails diffs={r._diffs} oldRow={r._old} newRow={r._new} changedBy={r.changed_by} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

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
    <div className={`rounded-lg p-3 flex items-center justify-between ${accentMap[accent] || accentMap.gray} border border-gray-700`}>
      <div>
        <div className="text-xs text-gray-300">{label}</div>
        <div className="text-xl font-bold mt-1">{value ?? 0}</div>
      </div>
    </div>
  );
}

function FilterDropdown({ value, onChange, ops = ["all", "INSERT", "UPDATE", "DELETE"] }) {
  // Responsive, dark-mode friendly select
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">Filter</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md px-3 py-2 border border-gray-700 bg-neutral-900 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        {ops.map((o) => (
          <option key={o} value={o}>
            {String(o).toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <input
        type="search"
        placeholder="Search (job id, field, user...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-64 px-3 py-2 rounded-md border border-gray-700 bg-neutral-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
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
  return <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{opText || "?"}</div>;
}

function DiffDetails({ diffs = [], oldRow = null, newRow = null, changedBy = null }) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-300">Changed by: <span className="font-medium text-gray-200">{changedBy || "—"}</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-400 mb-2">Old Row</div>
          <pre className="rounded-md bg-black/40 p-3 text-xs text-gray-200 overflow-auto">{prettyJSON(oldRow)}</pre>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-2">New Row</div>
          <pre className="rounded-md bg-black/40 p-3 text-xs text-gray-200 overflow-auto">{prettyJSON(newRow)}</pre>
        </div>
      </div>

      {diffs && diffs.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2">Field diffs</div>
          <div className="space-y-2">
            {diffs.map((d) => (
              <div key={d.key} className="p-2 border border-gray-800 rounded-md bg-neutral-900">
                <div className="text-sm font-medium text-gray-200">{formatKey(d.key)}</div>
                <div className="text-xs text-gray-400">OLD</div>
                <div className="text-sm text-gray-200">{d.oldVal || <span className="italic text-gray-500">—</span>}</div>
                <div className="text-xs text-gray-400 mt-2">NEW</div>
                <div className="text-sm text-green-200">{d.newVal || <span className="italic text-gray-500">—</span>}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- small utils ---------- */

function prettyJSON(obj) {
  try {
    if (obj === null || obj === undefined) return "—";
    return typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

function formatKey(k) {
  if (!k) return "Value";
  return k.replace(/[_\-]/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/\b\w/g, ch => ch.toUpperCase());
}
