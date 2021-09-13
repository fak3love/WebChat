export function range({start, end}: {start: number, end: number}) {
    const arr = [];

    for (let i = start; i < end; i++)
        arr.push(i);

    return arr;
}