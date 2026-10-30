/** 内联地球图标 - 用 currentColor，自动适配深浅色模式 */
export function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6" />
      <path d="M3.2 14.5h17.6" />
      <path d="M12 3c2.4 2.7 3.7 5.8 3.7 9s-1.3 6.3-3.7 9c-2.4-2.7-3.7-5.8-3.7-9S9.6 5.7 12 3z" />
    </svg>
  );
}
