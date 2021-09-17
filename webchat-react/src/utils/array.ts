export function range({start, end}: {start: number, end: number}) {
    const arr = [];

    for (let i = start; i < end; i++)
        arr.push(i);

    return arr;
}
export function first(arr: Array<any>, predicate: any) {
    for (let i = 0; i < arr.length; i++)
        if (predicate(arr[i]))
            return arr[i];

    return null;
}