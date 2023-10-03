export type ENV = (key: string, defaultValue?: any) => string;
export type ByteConverter = (
    bytes: number,
    isString?: boolean
  ) => string | { value: number; unit: string };