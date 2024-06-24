export function formatDate(date_string: string): string {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    return new Intl.DateTimeFormat("pl-PL", options).format(new Date(date_string));
}

