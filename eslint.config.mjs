import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    // P1/8 (F-10): إعادة تفعيل القواعد الحرجة الأربع — ممنوع إيقافها لاحقاً
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",

    // React rules
    // P1/8 (F-10): exhaustive-deps مفعّلة كخطأ — صفر نتائج وقت التفعيل
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    
    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    
    // General JavaScript rules
    // P1/8 (F-10): القاعدتان المتبقيتان من الأربع الحرجة
    "prefer-const": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-console": "off",
    "no-debugger": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  ignores: ["node_modules/**", ".next/**", ".next-static/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills", "scripts/init-db.js", "scripts/deploy-spaceship.ts"]
}];

export default eslintConfig;
