"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * حاجز أخطاء عام — يمنع انهيار الصفحة بالكامل عند فشل
 * أي شاشة، ويعرض بديلاً سيبرانياً مع إمكانية الاستعادة.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "خطأ غير معروف",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  private reset = () => this.setState({ hasError: false, message: "" });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section
        className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center"
        role="alert"
        aria-live="assertive"
      >
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,42,109,0.35)] bg-[rgba(255,42,109,0.08)]">
          <AlertTriangle className="h-7 w-7 text-[#ff2a6d]" aria-hidden="true" />
        </span>
        <p className="font-mono-cyber text-[11px] tracking-[0.35em] text-mute" dir="ltr">
          SYSTEM FAULT — RECOVERING
        </p>
        <h1 className="font-heading-cyber mt-3 text-2xl font-extrabold text-main sm:text-3xl">
          حدث خلل في هذه الوحدة
        </h1>
        <p className="mt-3 text-sm leading-7 text-sec">
          تعطّل عرض هذا القسم بسبب خطأ غير متوقع. أعد المحاولة أو عد إلى
          اللوحة الرئيسية — باقي أقسام الموقع تعمل بشكل طبيعي.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={this.reset}
            className="btn-primary-cyber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            إعادة المحاولة
          </button>
          <button
            onClick={() => {
              this.reset();
              window.location.hash = "#/home";
            }}
            className="btn-outline-cyber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            اللوحة الرئيسية
          </button>
        </div>
      </section>
    );
  }
}
