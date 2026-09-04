"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@global/components/button";
import { ErrorNotice } from "@global/components/error-notice";
import { Field } from "@global/components/field";
import { CaptchaView } from "@modules/hoadondientu.gdt.gov.vn/components/captcha-view";
import { useCaptcha } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-captcha";
import { useRefreshSession } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-refresh-session";

export function SessionRefreshForm({ onDone }: { onDone: () => void }) {
  const captcha = useCaptcha();
  const refresh = useRefreshSession();
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha.data?.key) return;

    try {
      await refresh.execute({
        password,
        cvalue: captchaValue.trim(),
        ckey: captcha.data.key,
      });
      setPassword("");
      setCaptchaValue("");
      onDone();
    } catch {
      setCaptchaValue("");
      void captcha.reload().catch(() => undefined);
    }
  }

  return (
    <form
      className="mt-5 grid gap-4 border-t border-[var(--border)] pt-5"
      onSubmit={submit}
    >
      <div>
        <p className="font-bold">Làm mới phiên thực sự</p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          EIF sẽ dùng tài khoản của session hiện tại cùng mật khẩu và captcha
          mới để đăng nhập lại Cục Thuế, cập nhật token/giờ hết hạn nhưng giữ
          nguyên EIF Session ID. Mật khẩu không được lưu.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
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
      </div>

      {captcha.error ? <ErrorNotice value={captcha.error} /> : null}
      {refresh.error ? <ErrorNotice value={refresh.error} /> : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          busy={refresh.loading}
          disabled={!captcha.data?.key}
        >
          Xác nhận làm mới
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
