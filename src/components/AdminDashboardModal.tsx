import React, { useState } from 'react';
import { ReportItem } from '../types';
import { 
  ShieldAlert, 
  X, 
  CheckCircle, 
  Ban, 
  AlertCircle, 
  UserX, 
  RotateCcw, 
  Activity, 
  Users, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  onUpdateReportStatus: (reportId: string, status: ReportItem['status'], actionTaken?: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  reports,
  onUpdateReportStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'stats' | 'topics'>('moderation');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [actionNote, setActionNote] = useState('');

  if (!isOpen) return null;

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  const handleTakeAction = (status: ReportItem['status'], actionSummary: string) => {
    if (!selectedReport) return;
    onUpdateReportStatus(
      selectedReport.id,
      status,
      actionNote.trim() ? `${actionSummary}: ${actionNote.trim()}` : actionSummary
    );
    setSelectedReport(null);
    setActionNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex h-14 items-center justify-between border-b border-stone-200 bg-stone-900 px-5 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-tight">
                SpeakCircle Moderation Console
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Admin Verified
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`min-h-[40px] px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'moderation'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Moderation Queue ({pendingReports.length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`min-h-[40px] px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'stats'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Platform Telemetry & Safety
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`min-h-[40px] px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'topics'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Topic Governance
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Reports Requiring Human Review
                </span>
                <span className="text-xs text-stone-500">{reports.length} total incidents logged</span>
              </div>

              {pendingReports.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-6 text-center text-xs text-stone-500">
                  <CheckCircle className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
                  <span>No pending reports. All safety incidents have been reviewed.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingReports.map(rep => (
                    <div
                      key={rep.id}
                      className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs hover:border-stone-300"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-rose-700">
                              {rep.reason}
                            </span>
                            <span aria-hidden="true" className="text-stone-300">·</span>
                            <span className="text-xs font-semibold text-stone-900">
                              User: {rep.reportedUserName} ({rep.reportedUserId})
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-700">
                            Details: "{rep.details || 'No additional comment provided by reporter.'}"
                          </p>
                          <div className="mt-2 text-[10px] text-stone-400">
                            Reported at: {new Date(rep.timestamp).toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
                        >
                          Review & Escalate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resolved Reports Section */}
              {resolvedReports.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                    Recently Processed Actions ({resolvedReports.length})
                  </h3>
                  <div className="space-y-2">
                    {resolvedReports.map(rep => (
                      <div
                        key={rep.id}
                        className="rounded-lg border border-stone-100 bg-stone-50 p-2.5 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium text-stone-800">{rep.reportedUserName}</span>
                          <span className="text-stone-500 ml-1.5">[{rep.reason}]</span>
                          <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                            Action: {rep.actionTaken || 'Reviewed and dismissed'}
                          </div>
                        </div>
                        <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] text-stone-700 font-medium">
                          {rep.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-5">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
                  <div className="flex items-center justify-center text-stone-500 mb-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="font-display text-xl font-bold text-stone-900">1,480</div>
                  <div className="text-[11px] text-stone-500">Registered Learners</div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
                  <div className="flex items-center justify-center text-emerald-600 mb-1">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div className="font-display text-xl font-bold text-emerald-700">142</div>
                  <div className="text-[11px] text-stone-500">Active in Queue</div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
                  <div className="flex items-center justify-center text-emerald-600 mb-1">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="font-display text-xl font-bold text-emerald-700">48</div>
                  <div className="text-[11px] text-stone-500">Active Voice Rooms</div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
                  <div className="flex items-center justify-center text-rose-600 mb-1">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="font-display text-xl font-bold text-rose-700">{reports.length}</div>
                  <div className="text-[11px] text-stone-500">Total Safety Reports</div>
                </div>
              </div>

              {/* Safety Health Breakdown */}
              <div className="rounded-xl border border-stone-200 bg-white p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
                  Safety System Health
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-600">Conversation Completion Rate</span>
                    <span className="font-semibold text-stone-900">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-600">Safe Interaction Score</span>
                    <span className="font-semibold text-emerald-700">99.1% Positive</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-600">Average Call Duration</span>
                    <span className="font-semibold text-stone-900">8.4 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Personal Info Leak Attempts Prevented</span>
                    <span className="font-semibold text-stone-900">31 automated blocks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-4 text-xs text-stone-700">
              <h3 className="font-semibold uppercase tracking-wider text-stone-600">
                Safe Topic Curation Standards
              </h3>
              <p>
                All SpeakCircle prompt banks are strictly curated to adhere to non-partisan, positive, and confidence-building criteria:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>No inflammatory political or religious debate questions.</li>
                <li>Zero solicitation of personal residence or contact credentials.</li>
                <li>Neutral career and academic challenges focused on personal growth.</li>
                <li>Prompts structured for 60 to 90 seconds of continuous spoken output.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Modal for Selected Report */}
        {selectedReport && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                Moderator Action on {selectedReport.reportedUserName}
              </h3>
              <p className="text-xs text-stone-600 mb-3">
                Reason flagged: <strong className="text-rose-700">{selectedReport.reason}</strong>
              </p>

              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                placeholder="Optional moderator notes explaining the escalation decision..."
                className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-emerald-600 focus:outline-hidden mb-4"
                rows={2}
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() =>
                    handleTakeAction('action_taken', 'Issued formal first warning for guidelines violation')
                  }
                  className="rounded-xl border border-stone-200 bg-stone-50 py-2 font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Issue Formal Warning
                </button>
                <button
                  onClick={() =>
                    handleTakeAction('action_taken', 'Restricted account from matching for 24 hours')
                  }
                  className="rounded-xl border border-amber-300 bg-amber-50 py-2 font-semibold text-amber-900 hover:bg-amber-100"
                >
                  24-Hour Restriction
                </button>
                <button
                  onClick={() =>
                    handleTakeAction('action_taken', 'Account permanently suspended for serious misconduct')
                  }
                  className="rounded-xl bg-rose-700 py-2 font-semibold text-white hover:bg-rose-800"
                >
                  Suspend / Ban Account
                </button>
                <button
                  onClick={() => handleTakeAction('dismissed', 'Reviewed and dismissed as non-violation')}
                  className="rounded-xl border border-stone-200 bg-white py-2 font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Dismiss Report
                </button>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="mt-3 w-full py-1 text-center text-xs text-stone-400 hover:text-stone-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
