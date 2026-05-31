const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBrlAmount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }

  return brlFormatter.format(value);
}

export function parseBrlAmount(input: string): number | null {
  const digits = input.replace(/\D/g, '');

  if (digits.length === 0) {
    return null;
  }

  const value = Number(digits) / 100;

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}

export function maskBrlInput(input: string): string {
  const value = parseBrlAmount(input);

  if (value === null) {
    return '';
  }

  return formatBrlAmount(value);
}
