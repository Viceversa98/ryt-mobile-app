export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BiometricUserCancelledError extends Error {
  constructor() {
    super("Authentication was cancelled");
    this.name = "BiometricUserCancelledError";
  }
}

type AppError = {
  message: string;
};

export const mapUnknownToAppError = (err: unknown): AppError => {
  if (err instanceof Error) {
    return { message: err.message };
  }
  return { message: "Something went wrong" };
};
