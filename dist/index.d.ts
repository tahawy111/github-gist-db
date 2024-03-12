interface SchemaTypes {
    [key: string]: "String" | "Number" | "Boolean" | "Object" | "Array" | "Undefined" | "Null" | "Symbol" | "BigInt";
}
type SchemaType<T> = {
    [K in keyof T]: T[K] extends "String" ? string : T[K] extends "Number" ? number : T[K] extends "Boolean" ? boolean : T[K] extends "Object" ? Object : T[K] extends "Array" ? Array<any> : T[K] extends "Undefined" ? undefined : T[K] extends "Null" ? null : T[K] extends "Symbol" ? Symbol : T[K] extends "BigInt" ? bigint : any;
} & {
    id?: string;
};
type SchemaTypeForQuery<T> = Partial<SchemaType<T>>;
declare class DB<T extends SchemaTypes> {
    private readonly url;
    private readonly schema;
    private readonly schemaName;
    private readonly projectName;
    private readonly gistId?;
    private readonly timeStamps?;
    private readonly githubToken;
    private readonly dbFileName;
    constructor(schema: T, { schemaName, projectName, gistId, timeStamps, githubToken, }: {
        schemaName: string;
        projectName: string;
        gistId?: string;
        timeStamps?: boolean;
        githubToken: string;
    });
    private handleAPIError;
    private fetchGistData;
    private PrepareGistBeforeRequestTheFile;
    private updateGistFile;
    private updateGistContent;
    private getList;
    create(payload: SchemaType<T>): Promise<any>;
    findFirst(query: SchemaTypeForQuery<T>): Promise<SchemaType<T> | undefined>;
    findMany(query?: SchemaTypeForQuery<T>): Promise<SchemaType<T>[] | undefined>;
    findByIdAndUpdate(id: string, query: SchemaTypeForQuery<T>): Promise<SchemaType<T> | undefined>;
    findOneAndUpdate(searchQuery: SchemaTypeForQuery<T>, query: SchemaTypeForQuery<T>): Promise<SchemaType<T> | undefined>;
    findByIdAndDelete(id: string): Promise<"Ok" | undefined>;
    findOneAndDelete(searchQuery: SchemaTypeForQuery<T>): Promise<"Ok" | undefined>;
}
export { DB };
