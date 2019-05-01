export function notNullFilter<TValue>(
  value: TValue | void | null | undefined,
): value is TValue {
  return !!value;
}
