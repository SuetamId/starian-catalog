export interface NormalizedHttpError {
  status: number;
  message: string;
  recoverable: boolean;
}

export function isNormalizedHttpError(error: unknown): error is NormalizedHttpError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Record<string, unknown>;

  return (
    typeof candidate['status'] === 'number' &&
    typeof candidate['message'] === 'string' &&
    typeof candidate['recoverable'] === 'boolean'
  );
}
