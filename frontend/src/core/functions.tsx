/**
 * Utility Functions
 * @module core/functions
 */

/**
 * Converts UTC time to local time and formats it as 'YYYY-MM-DD HH:mm'.
 * @param {string} utcTime - The UTC time string to convert.
 * @returns {string} - The formatted local time string.
 */
export const formatUtcToLocalDateTime = (utcTime: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const date = new Date(utcTime);
    const formattedDate = new Intl.DateTimeFormat('default', options)
        .format(date)
        .replace(',', '') // Remove the comma if present
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'); // Adjust to YYYY-MM-DD format

    return formattedDate;
};
