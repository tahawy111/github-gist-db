interface SchemaTypes {
    [key: string]: "String" | "Number" | "Boolean" | "Object" | "Array" | "Undefined" | "Null" | "Symbol" | "BigInt";
}
type SchemaType<T> = {
    [K in keyof T]: T[K] extends "String" ? string : T[K] extends "Number" ? number : T[K] extends "Boolean" ? boolean : T[K] extends "Object" ? Object : T[K] extends "Array" ? Array<any> : T[K] extends "Undefined" ? undefined : T[K] extends "Null" ? null : T[K] extends "Symbol" ? Symbol : T[K] extends "BigInt" ? bigint : any;
} & {
    id?: string;
};
type SchemaTypeForQuery<T> = {
    [K in keyof T]?: T[K] extends "String" ? string : T[K] extends "Number" ? number : T[K] extends "Boolean" ? boolean : T[K] extends "Object" ? Object : T[K] extends "Array" ? Array<any> : T[K] extends "Undefined" ? undefined : T[K] extends "Null" ? null : T[K] extends "Symbol" ? Symbol : T[K] extends "BigInt" ? bigint : any;
} & {
    id?: string;
};
declare class DB<T extends SchemaTypes> {
    private url;
    schema: T;
    schemaName: string;
    projectName: string;
    gistId?: string;
    timeStamps?: boolean;
    githubToken: string;
    constructor(schema: T, { schemaName, projectName, gistId, timeStamps, githubToken, }: {
        schemaName: string;
        projectName: string;
        gistId?: string;
        timeStamps?: boolean;
        githubToken: string;
    });
    create(payload: SchemaType<T>): Promise<any>;
    findFirst(query: SchemaTypeForQuery<T>): Promise<SchemaType<T> | undefined>;
    findMany(query?: SchemaTypeForQuery<T>): Promise<SchemaType<T>[]>;
    findByIdAndUpdate(id: string, query: SchemaTypeForQuery<T>): Promise<SchemaType<T>[]>;
}
export default DB;
