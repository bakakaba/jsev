import { IObject } from "../types/Object";

export function getPropertyByNameIgnoreCase(obj: IObject<any>, name: string) {
    const nName = name.toLocaleLowerCase();
    const key = Object.keys(obj)
        .find((x) => x.toLocaleLowerCase() === nName);

    return key ? obj[key] : undefined;
}
