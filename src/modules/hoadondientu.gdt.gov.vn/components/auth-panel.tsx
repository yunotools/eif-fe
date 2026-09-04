"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@global/components/button";
import { Card } from "@global/components/card";
import { Field } from "@global/components/field";
import { ErrorNotice } from "@global/components/error-notice";
import { CaptchaView } from "@modules/hoadondientu.gdt.gov.vn/components/captcha-view";
import { useAttachSession } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-attach-session";
import { useAuthenticate } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-authenticate";
import { useCaptcha } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-captcha";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";

export function AuthPanel() {
  const captcha = useCaptcha();
  const auth = useAuthenticate();
  const attach = useAttachSession();
  const session = useHddtSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [remember, setRemember] = useState(true);
  const [manualSessionId, setManualSessionId] = useState("");

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha.data?.key) return;

    try {
      const response = await auth.execute({
        username: username.trim(),
        password,
        cvalue: captchaValue.trim(),
        ckey: captcha.data.key,
      });
      session.acceptAuthentication(response, username, remember);
      setPassword("");
      setCaptchaValue("");
      void captcha.reload().catch(() => undefined);
    } catch {
      setCaptchaValue("");
      void captcha.reload().catch(() => undefined);
    }
  }

  async function attachManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await attach.execute(manualSessionId, remember);
    setManualSessionId("");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <h2 className="text-xl font-bold">Đăng nhập</h2>
        <form className="mt-5 grid gap-4" onSubmit={submitLogin}>
          <Field label="Tài khoản / Mã số thuế">
            <input
              className="eif-input"
              autoComplete="username"
              value={username}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
              required
            />
          </Field>
          <Field label="Mật khẩu">
            <input
              className="eif-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
              required
            />
          </Field>
          <Field label="Captcha">
            <CaptchaView
              svg={captcha.data?.content}
              loading={captcha.loading}
              onReload={() => void captcha.reload().catch(() => undefined)}
            />
            <input
              className="eif-input mt-2 uppercase"
              value={captchaValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setCaptchaValue(event.target.value)
              }
              placeholder="Nhập captcha"
              autoCapitalize="characters"
              required
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setRemember(event.target.checked)
              }
            />
            Ghi nhớ đăng nhập
          </label>

          {captcha.error ? <ErrorNotice value={captcha.error} /> : null}
          {auth.error ? <ErrorNotice value={auth.error} /> : null}

          <Button
            type="submit"
            busy={auth.loading}
            disabled={!captcha.data?.key}
          >
            Đăng nhập
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Dùng session có sẵn</h2>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Session ID do backend EIF tạo sau khi đăng nhập thành công. Ở một
          phiên EIF đang đăng nhập, mở khối “Phiên đăng nhập” và bấm “Sao chép
          Session ID”. Trên cùng trình duyệt bạn thường không cần nhập lại vì
          EIF tự khôi phục session đã lưu.
        </p>
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event: FormEvent<HTMLFormElement>) =>
            void attachManual(event).catch(() => undefined)
          }
        >
          <Field label="Session ID">
            <input
              className="eif-input text-xs"
              type="password"
              autoComplete="off"
              value={manualSessionId}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setManualSessionId(event.target.value)
              }
              placeholder="Nhập session ID"
              required
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setRemember(event.target.checked)
              }
            />
            Ghi nhớ đăng nhập
          </label>

          {attach.error ? <ErrorNotice value={attach.error} /> : null}

          <Button
            type="submit"
            variant="secondary"
            busy={attach.loading || session.phase === "validating"}
          >
            Dùng session
          </Button>
        </form>
      </Card>
    </div>
  );
}
