"use client";

import { useId } from "react";

/**
 * حقل مصيدة مخفي للبوتات — لا يراه الزوار ولا قارئات الشاشة.
 * لا نستخدم إزاحة سالبة (left:-10000px): في صفحة RTL تُنشئ تمريراً أفقياً بعرض 10 آلاف بكسل
 * فيصغّر Chrome على أندرويد الصفحة وتظهر فارغة. نقصّ العنصر في مكانه بدلاً من ذلك.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = `hp-${useId().replace(/:/g, "")}`;
  return (
    <div aria-hidden="true" style={{ position: "absolute", insetInlineStart: 0, top: 0, width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0, opacity: 0, pointerEvents: "none" }}>
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
