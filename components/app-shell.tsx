import Link from "next/link";
import { Suspense } from "react";
import { Home } from "lucide-react";

import { AppNav } from "@/components/app-nav";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <header className="w-full border-b border-foreground/10">
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-3 p-3 px-5">
            <div className="flex items-center justify-between">
              <Link
                href="/entries"
                className="inline-flex items-center gap-2 font-semibold"
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background"
                  aria-hidden
                >
                  <Home size={18} />
                </span>
                <span className="text-base">DailyLog</span>
              </Link>
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
            <AppNav />
          </div>
        </header>
        <div className="flex-1 w-full max-w-3xl p-5 flex flex-col gap-6">
          {children}
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
