// Pagefind ESM loader
// 必须是 server component 才能正确渲染 inline script 到 body
// pagefind.js 是 ESM 模块（export{...}），普通 <script> 标签加载无效

const PAGEFIND_LOADER = `
import('/pagefind/pagefind.js').then((m) => {
  window.pagefind = m;
  if (typeof m.init === 'function') return m.init();
}).then(() => {
  window.dispatchEvent(new Event('pagefind-ready'));
}).catch((err) => {
  console.error('[pagefind] load failed:', err);
  window.dispatchEvent(new Event('pagefind-failed'));
});
`;

export function PagefindLoader() {
  // Server component, 渲染到 html 中
  return (
    <script
      id="pagefind-loader"
      dangerouslySetInnerHTML={{ __html: PAGEFIND_LOADER }}
    />
  );
}