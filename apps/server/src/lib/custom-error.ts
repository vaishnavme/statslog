class CustomError extends Error {
  code: number; // Declare the code property with its type

  constructor({
    code = 500,
    message = "Something went wrong",
  }: {
    code?: number;
    message?: string;
  }) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}

export default CustomError;
