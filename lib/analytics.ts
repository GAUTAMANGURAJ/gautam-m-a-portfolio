/**
 * Privacy-light event tracking. Works with GoatCounter and/or Plausible when those scripts are loaded
 * (see components/studio/Analytics.tsx); otherwise it silently does nothing.
 * Never pass personal data (names, emails, message text) — only coarse, non-identifying labels.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    goatcounter?: { count?: (v: { path: string; title?: string; event?: boolean }) => void };
    plausible?: (name: string, opts?: { props?: Props }) => void;
  }
}

export type AnalyticsEvent =
  | 'resume_download'
  | 'resume_view'
  | 'project_open'
  | 'project_ask'
  | 'contact_reason'
  | 'contact_submit'
  | 'contact_error'
  | 'email_copy'
  | 'email_click'
  | 'booking_click'
  | 'outbound_linkedin'
  | 'outbound_github'
  | 'palette_open'
  | 'path_switch'
  | 'theme_toggle';

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === 'undefined') return;
  try {
    const label = props?.id ? `${event}:${String(props.id)}` : event;
    window.goatcounter?.count?.({ path: `event/${label}`, title: label, event: true });
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the site */
  }
}
