export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function getTimeDurationByDate({startDate, endDate, include}: {startDate: Date, endDate: Date, include?: 'hours' | 'hoursWithMinutes' | 'time' | 'onlyDate'}) {
    let date = new Date(endDate.getTime() - startDate.getTime());

    let timeCount = date.getFullYear() - 1970;

    if (include === 'onlyDate') {

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
            if (date.getUTCHours() === 0 && date.getMinutes() < 15) {
                timeCount = date.getMinutes();

                if (timeCount === 0)
                    return 'just now';

                if (timeCount === 1)
                    return `${timeCount} minute ago`;

                if (timeCount <= 5)
                    return '5 minutes ago';

                if (timeCount <= 10)
                    return '10 minutes ago';

                if (timeCount <= 15)
                    return '15 minutes ago';
            }

            return getTimeFormat(date);
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

// export function todayMinusDate(date: Date) {
//     const today = new Date();
//     const other_date = '15.11.2013';
//     const dateparts = other_date.split('.');
//     const otherDate = new Date(dateparts[2], dateparts[1]-1, dateparts[0]); // substract 1 month because month starting with 0
//
//     var difference = today.getTime() - otherDate.getTime(); // difference in ms
// }
export function getTimeFormat(date: Date) {
    const minutes = date.getMinutes();

    return `${date.getHours()}:${minutes >= 10 ? minutes : '0' + minutes}`;
}
export function getDateFormat(date: Date) {
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
export function getDateForStatus(statusDate: string) {
    const date = new Date(Date.now() - new Date(statusDate).getTime());

    if (date.getUTCHours() === 0 && date.getMinutes() < 15) {
        const timeCount = date.getMinutes();

        if (timeCount === 0)
            return 'just now';

        if (timeCount === 1)
            return `${timeCount} minute ago`;

        if (timeCount <= 5)
            return '5 minutes ago';

        if (timeCount <= 10)
            return '10 minutes ago';

        if (timeCount <= 15)
            return '15 minutes ago';
    }

    return getTimeFormat(date);
}
export function getDateForMessageSection(startDate: string | Date) {
    startDate = new Date(startDate);
    const nowDate = new Date();

    let date = new Date(nowDate.getTime() - startDate.getTime());

    if (date.getDate() === 1 || date.getDate() === 2) {
        const days = nowDate.getDate() - startDate.getDate();

        if (days === 0)
            return 'today';

        if (days === 1)
            return 'yesterday';
    }

    return getDateFormat(startDate);
}
export function getDateForMessages() {

}