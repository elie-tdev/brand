// TODO: Log the error to Google Stackdriver, Rollbar etc.
export const reportError = (error: Error) => {
  // tslint:disable-next-line: no-console
  console.error(JSON.stringify(error))
}
