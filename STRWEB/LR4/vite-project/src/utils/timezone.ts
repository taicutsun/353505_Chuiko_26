export interface TimeZoneInfo {
  timezone: string;
  currentTime: string;
  utcTime: string;
  offset: string;
}

export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getCurrentTimeInTimeZone = (
  timezone: string = getUserTimeZone()
): Date => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
};

export const formatDateTime = (
  date: string | Date,
  timezone: string = getUserTimeZone(),
  includeTime: boolean = true
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  return dateObj.toLocaleString("en-US", options);
};

export const formatDateTimeUTC = (
  date: string | Date,
  includeTime: boolean = true
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  return dateObj.toLocaleString("en-US", options);
};

export const getTimeZoneOffset = (
  timezone: string = getUserTimeZone()
): string => {
  const now = new Date();
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const localTime = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );

  const offsetMs = localTime.getTime() - utcTime.getTime();
  const offsetHours = Math.floor(offsetMs / 3600000);
  const offsetMinutes = Math.floor((offsetMs % 3600000) / 60000);

  const sign = offsetHours >= 0 ? "+" : "-";
  return `${sign}${Math.abs(offsetHours)
    .toString()
    .padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;
};

export const getTimeZoneInfo = (): TimeZoneInfo => {
  const timezone = getUserTimeZone();
  const now = new Date();

  return {
    timezone,
    currentTime: formatDateTime(now, timezone),
    utcTime: formatDateTimeUTC(now),
    offset: getTimeZoneOffset(timezone),
  };
};

export const formatDateForDisplay = (
  date: string | Date,
  timezone: string = getUserTimeZone()
): { local: string; utc: string } => {
  return {
    local: formatDateTime(date, timezone),
    utc: formatDateTimeUTC(date),
  };
};
