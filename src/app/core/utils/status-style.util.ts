import { Appointment } from '../models';

export function getAppointmentStatusClass(status: Appointment['status']): string {
  const map: Record<Appointment['status'], string> = {
    PendingPayment: '!bg-[var(--color-warning-soft)] !text-[var(--color-warning)]',
    Confirmed: '!bg-[var(--color-primary-soft)] !text-[var(--color-primary)]',
    Arrived: '!bg-[var(--color-success-soft)] !text-[var(--color-success)]',
    Completed: '!bg-[var(--color-surface-2)] !text-[var(--color-muted)]',
    NoShow: '!bg-[var(--color-danger-soft)] !text-[var(--color-danger)]',
    Cancelled: '!bg-[var(--color-surface-2)] !text-[var(--color-faint)]',
  };
  return map[status] ?? '!bg-[var(--color-surface-2)] !text-[var(--color-text)]';
}

export function getPaymentStatusClass(paymentStatus?: string | null): string {
  if (paymentStatus === 'Paid')
    return '!bg-[var(--color-success-soft)] !text-[var(--color-success)]';
  if (paymentStatus === 'Refunded')
    return '!bg-[var(--color-surface-2)] !text-[var(--color-muted)]';
  return '!bg-[var(--color-warning-soft)] !text-[var(--color-warning)]';
}

export function getStatusAccentClass(status: Appointment['status']): string {
  const map: Record<string, string> = {
    Confirmed: 'bg-[var(--color-primary)]',
    PendingPayment: 'bg-[var(--color-warning)]',
    Arrived: 'bg-[var(--color-success)]',
  };
  return map[status] ?? 'bg-[var(--color-border-strong)]';
}
