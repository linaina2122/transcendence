export const convertIsoToTime:any = (isoTimestamp: any) => {
  const date = new Date(isoTimestamp);
  const options: any = { hour: "numeric", minute: "numeric", hour12: true };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};
