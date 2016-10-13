export default class Result {
  constructor({ parsed, errors }) {
    this.parsed = parsed;
    this.errors = errors;
  }

  isSuccess() {
    return this.errors.length === 0;
  }

  get data() {
    return this.parsed;
  }

  isFailure() {
    return !this.isSuccess();
  }
}
