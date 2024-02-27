import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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
} & { id: "uuid" };

class DB<T extends SchemaTypes> {
  // Properties
  private url = "https://api.github.com/gists";
  schema: T;
  schemaName: string;
  projectName: string;
  gistId?: string;
  timeStamps?: boolean;
  githubToken: string;

  // Constructor
  constructor(
    schema: T,
    {
      schemaName,
      projectName,
      gistId,
      timeStamps,
      githubToken,
    }: {
      schemaName: string;
      projectName: string;
      gistId?: string;
      timeStamps?: boolean;
      githubToken: string;
    }
  ) {
    this.schema = schema;
    this.schemaName = schemaName;
    this.projectName = projectName;
    this.gistId = gistId;
    this.timeStamps = timeStamps;
    this.githubToken = githubToken;
  }

  async create(payload: SchemaType<T>) {
    let reqPayload: any = {
      ...payload,
      id: crypto.randomUUID(),
    };

    if (this.timeStamps) {
      reqPayload.createdAt = new Date().toISOString();
      reqPayload.updatedAt = new Date().toISOString();
    }

    if (this.gistId) {
      // get and push
      const res = await axios.get(`${this.url}/${this.gistId}`, {
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
        },
      });

      const list: SchemaType<T>[] = JSON.parse(
        res.data.files["test.productSchema.json"].content
      );

      list.push(reqPayload);

      const update = await axios.patch(
        `${this.url}/${this.gistId}`,
        {
          files: {
            [`${this.projectName}.${this.schemaName}.json`]: {
              content: `${JSON.stringify(list)}`,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
          },
        }
      );

      return update.data;
    } else {
      // create first object inside and array
      const res = await axios.post(
        `${this.url}`,
        {
          description: `
          Project: ${this.projectName}
          && Schema: ${this.schemaName}
          `,
          public: false,
          files: {
            [`${this.projectName}.${this.schemaName}.json`]: {
              content: `[${JSON.stringify(reqPayload)}]`,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
          },
        }
      );
      return res.data;
    }
  }
}

const productSchema = new DB(
  {
    name: "String",
    price: "Number",
  },
  {
    githubToken: process.env.GITHUB_ACCESS_TOKEN!,
    schemaName: "productSchema",
    projectName: "test",
    gistId: "48ec463b54be5973729a108297860555",
    timeStamps: true,
  }
);

(async () => {
  const product = await productSchema.create({
    id: "uuid",
    name: "Product Name",
    price: 100,
  });

  console.log(product);
})();
