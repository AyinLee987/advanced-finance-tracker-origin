(function (root, factory) {
  let financeDateUtils;

  try {
    financeDateUtils = factory(require("luxon"));
    module.exports = financeDateUtils;
  } catch (error) {
    /* istanbul ignore next: Browser-only fallback is exercised outside Jest */
    financeDateUtils = factory(root.luxon);
  }

  root.financeDateUtils = financeDateUtils;
})(globalThis, function (luxon) {
  const { DateTime } = luxon;

  const resolveZone = (zone) => {
    if (zone) {
      return zone;
    }

    if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "system";
    }

    return "system";
  };

  const getDateTime = (dateValue, zone) => {
    return DateTime.fromISO(dateValue, { zone: resolveZone(zone) });
  };

  const normalizeToLocalDateKey = (dateValue, zone) => {
    const dateTime = getDateTime(dateValue, zone);
    return dateTime.isValid ? dateTime.toISODate() : dateValue;
  };

  const formatLocalDate = (dateValue, locale, zone) => {
    const dateTime = getDateTime(dateValue, zone);
    if (!dateTime.isValid) {
      return String(dateValue);
    }

    return dateTime.setLocale(locale || "en-US").toFormat("MMM d, yyyy");
  };

  const formatMonthLabel = (dateValue, locale, zone) => {
    const dateTime = getDateTime(dateValue, zone);
    if (!dateTime.isValid) {
      return String(dateValue);
    }

    return dateTime.setLocale(locale || "en-US").toFormat("MMMM yyyy");
  };

  const compareLocalDateStringsDesc = (leftDate, rightDate, zone) => {
    const leftDateTime = getDateTime(leftDate, zone);
    const rightDateTime = getDateTime(rightDate, zone);

    if (!leftDateTime.isValid || !rightDateTime.isValid) {
      return 0;
    }

    return rightDateTime.toMillis() - leftDateTime.toMillis();
  };

  const isOnOrBeforeLocalDay = (dateValue, cutoffValue, zone) => {
    const leftDateTime = getDateTime(dateValue, zone);
    const rightDateTime = getDateTime(cutoffValue, zone);

    if (!leftDateTime.isValid || !rightDateTime.isValid) {
      return false;
    }

    const left = leftDateTime.startOf("day").toMillis();
    const right = rightDateTime.startOf("day").toMillis();
    return left <= right;
  };

  return {
    resolveZone,
    getDateTime,
    normalizeToLocalDateKey,
    formatLocalDate,
    formatMonthLabel,
    compareLocalDateStringsDesc,
    isOnOrBeforeLocalDay,
  };
});
