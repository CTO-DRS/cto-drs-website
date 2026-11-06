"use client";

import { useId } from "react";

/** حقل مصيدة مخفي للبوتات — لا يراه الزوار ولا قارئات الشاشة */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = `hp-${useId().replace(/:/g, "")}`;
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
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
