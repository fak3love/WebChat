export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function getTimeDurationByDate({startDate, endDate, include}: {startDate: Date, endDate: Date, include?: 'hours' | 'hoursWithMinutes' | 'time' | 'onlyDate'}) {
    let date = new Date(endDate.getTime() - startDate.getTime());

    let timeCount = date.getFullYear() - 1970;

    if (include === 'onlyDate') {
        if (date.getDate() === 1 || date.getDate() === 2) {
            const days = endDate.getDate() - startDate.getDate();

            if (days === 0)
                return 'today';

            if (days === 1)
                return 'yesterday';
        }

        return `${startDate.getDate()} ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
    }

    if (timeCount === 1)
        return `${timeCount} year ago`;

    if (timeCount > 1)
        return `${timeCount} years ago`;

    timeCount = date.getMonth();

    if (timeCount === 1)
        return `${timeCount} month ago`;

    if (timeCount > 1)
        return `${timeCount} months ago`;

    timeCount = date.getDate() - 1;

    if (timeCount === 0) {
        if (include === undefined)
            return 'today';

        if (include === 'hours') {
            timeCount = date.getUTCHours();

            if (timeCount === 1)
                return `${timeCount} hour ago`;

            if (timeCount > 1)
                return `${timeCount} hours ago`;

            return 'about one hour ago';
        }

        if (include === 'hoursWithMinutes') {
            timeCount = date.getUTCHours();

            if (timeCount === 1)
                return `${timeCount} hour ago`;

            if (timeCount > 1)
                return `${timeCount} hours ago`;

            timeCount = date.getMinutes();

            if (timeCount === 1)
                return `${timeCount} minute ago`;

            if (timeCount > 1)
                return `${timeCount} minutes ago`;

            return 'just now';
        }

        if (include === 'time') {
            const hours = date.getUTCHours();
            const minutes = date.getMinutes();

            return `${hours}:${minutes >= 10 ? minutes : '0' + minutes}`;
        }
    }

    if (timeCount === 1)
        return 'yesterday';

    if (timeCount >= 12 || timeCount < 7)
        return `${timeCount} days ago`;

    return 'about one week ago';
}
export function getTimeFormat(date: Date) {
    const minutes = date.getMinutes();

    return `${date.getHours()}:${minutes >= 10 ? minutes : '0' + minutes}`;
}