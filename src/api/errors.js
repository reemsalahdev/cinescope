// A dedicated error type lets pages tell "this title doesn't exist" (show a 404)
// apart from "the network failed" (show a retry button).
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
