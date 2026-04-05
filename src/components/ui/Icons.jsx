export const IconDash = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <rect x={3} y={3} width={7} height={7} rx={1} /><rect x={14} y={3} width={7} height={7} rx={1} />
    <rect x={3} y={14} width={7} height={7} rx={1} /><rect x={14} y={14} width={7} height={7} rx={1} />
  </svg>
)
export const IconTxn = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
)
export const IconInsight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 5.5-3 7H8c-.5-1.5-3-3.5-3-7a7 7 0 0 1 7-7z" />
    <path d="M9 21h6m-6-3h6" />
  </svg>
)
export const IconMoon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
export const IconSun = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx={12} cy={12} r={5} />
    <line x1={12} y1={1} x2={12} y2={3} /><line x1={12} y1={21} x2={12} y2={23} />
    <line x1={4.22} y1={4.22} x2={5.64} y2={5.64} /><line x1={18.36} y1={18.36} x2={19.78} y2={19.78} />
    <line x1={1} y1={12} x2={3} y2={12} /><line x1={21} y1={12} x2={23} y2={12} />
  </svg>
)
export const IconPlus = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
  </svg>
)
export const IconSearch = ({ className }) => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className || 'search-icon'}>
    <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
)
export const IconEdit = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
export const IconTrash = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6m4-6v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
export const IconDownload = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} />
  </svg>
)
export const IconX = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
  </svg>
)
export const IconRefresh = ({ spinning }) => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className={spinning ? 'spin' : ''}>
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)
export const IconTrendUp = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)
export const IconTrendDown = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
)
