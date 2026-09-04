"use client";

import { useState } from "react";
import { Button } from "@global/components/button";
import { Card } from "@global/components/card";
import { ErrorNotice } from "@global/components/error-notice";
import { useCountdown } from "@global/hooks/use-countdown";
import { formatDateTime } from "@global/utils/date";
import { SessionRefreshForm } from "@modules/hoadondientu.gdt.gov.vn/components/session-refresh-form";
import { useLogoutSession } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-logout-session";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { useHddtSessionSync } from "@modules/hoadondientu.gdt.gov.vn/providers/session-sync-provider";

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function maskedSessionId(value: string): string {
  if (value.length <= 16) return "••••••••";
  return `${value.slice(0, 8)}••••••••${value.slice(-8)}`;
}

export function SessionPanel() {
  const { phase, session } = useHddtSession();
  const { syncError, syncNow } = useHddtSessionSync();
  const logout = useLogoutSession();
  const countdown = useCountdown(session?.expiredAt);
  const [showSessionId, setShowSessionId] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRefresh, setShowRefresh] = useState(false);

  if (!session) return null;
  const currentSession = session;

  async function copySessionId() {
    await copyText(currentSession.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  return (
    <Card className="border-[var(--accent)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="eif-eyebrow">Phiên đăng nhập</p>
          <h2 className="mt-1 text-xl font-bold">
            {session.username || "Đã xác thực"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
            <span>Hết hạn: {formatDateTime(session.expiredAt)}</span>
            <span>Cập nhật: {formatDateTime(session.lastSyncedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Còn lại
            </div>
            <div className="text-lg font-black tabular-nums text-[var(--accent)]">
              {countdown.text}
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            busy={phase === "validating"}
            onClick={() => void syncNow().catch(() => undefined)}
          >
            Kiểm tra phiên
          </Button>
          <Button
            type="button"
            onClick={() => setShowRefresh((value) => !value)}
          >
            Làm mới phiên
          </Button>
          <Button type="button" variant="danger" onClick={() => void logout()}>
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              EIF Session ID
            </div>
            <code className="mt-1 block break-all text-xs">
              {showSessionId ? session.id : maskedSessionId(session.id)}
            </code>
            <p className="mt-1 text-[11px] text-[var(--muted)]">
              Đây chính là Session ID dùng ở mục “Dùng session có sẵn”. Hãy coi
              nó như thông tin đăng nhập và không chia sẻ công khai.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSessionId((value) => !value)}
            >
              {showSessionId ? "Ẩn" : "Hiện"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void copySessionId().catch(() => undefined)}
            >
              {copied ? "Đã sao chép" : "Sao chép Session ID"}
            </Button>
          </div>
        </div>
      </div>

      {syncError ? (
        <div className="mt-4">
          <ErrorNotice value={syncError} tone="warning" />
        </div>
      ) : null}
      {showRefresh ? (
        <SessionRefreshForm onDone={() => setShowRefresh(false)} />
      ) : null}
    </Card>
  );
}
