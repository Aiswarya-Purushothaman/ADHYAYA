export function formatDateTimeToIST(isoString: string) {
  const date = new Date(isoString);
  const options: object = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
  }

  return date.toLocaleString('en-IN', options)

}