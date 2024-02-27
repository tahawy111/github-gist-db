interface SchemaTypes {
    [key: string]:
      | "String"
      | "Number"
      | "Boolean"
      | "Object"
      | "Array"
      | "Undefined"
      | "Null"
      | "Symbol"
      | "BigInt";
  }
  
  type SchemaType<T> = {
    [K in keyof T]: T[K] extends "String"
      ? string
      : T[K] extends "Number"
      ? number
      : T[K] extends "Boolean"
      ? boolean
      : T[K] extends "Object"
      ? Object
      : T[K] extends "Array"
      ? Array<any>
      : T[K] extends "Undefined"
      ? undefined
      : T[K] extends "Null"
      ? null
      : T[K] extends "Symbol"
      ? Symbol
      : T[K] extends "BigInt"
      ? bigint
      : any; // Default to 'any' for other types
  };
  
  class DB<T extends SchemaTypes> {
    // Properties
    schema: T;
  
    // Constructor
    constructor(schema: T) {
      this.schema = schema;
    }
  
    create(payload: SchemaType<T>) {
      // Implementation of create method
    }
  }
  
  const productSchema = new DB({
    name: "String",
    price: "Number",
  });
  
  productSchema.create({
      name: "Product Name",
      price: 100
  });