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
} & { id?: string };

type SchemaTypeForQuery<T> = {
  [K in keyof T]?: T[K] extends "String"
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
} & { id?: string };

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
        res.data.files[`${this.projectName}.${this.schemaName}.json`].content
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

  async findFirst(query: SchemaTypeForQuery<T>) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    return list.find((item) => {
      for (let key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }
  async findMany(query?: SchemaTypeForQuery<T>) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    if (query) {
      return list.filter((item) => {
        for (let key in query) {
          if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    } else {
      return list;
    }
  }
  async findByIdAndUpdate(id: string, query: SchemaTypeForQuery<T>) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    let updatedIndex = 0;

    list.forEach((item: any, index) => {
      if (item.id === id) {
        updatedIndex = index;
        for (let key in query) {
          item[key] = (query as Record<string, any>)[key];
        }
        item.updatedAt = new Date().toISOString();
      }
    });

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

    const updatedList: SchemaType<T>[] = JSON.parse(
      update.data.files["test.productSchema.json"].content
    );

    return updatedList[updatedIndex];
  }
  async findOneAndUpdate(
    searchQuery: SchemaTypeForQuery<T>,
    query: SchemaTypeForQuery<T>
  ) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    let updatedIndex = 0;

    list.forEach((item: any, index) => {
      for (let key in searchQuery) {
        if (item[key] === searchQuery[key]) {
          updatedIndex = index;
          for (let key in query) {
            item[key] = (query as Record<string, any>)[key];
          }
          item.updatedAt = new Date().toISOString();
        }
      }
    });

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

    const updatedList: SchemaType<T>[] = JSON.parse(
      update.data.files["test.productSchema.json"].content
    );

    return updatedList[updatedIndex];
  }
  async findByIdAndDelete(id: string) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    let updatedIndex = 0;

    const deleted = list.filter((item) => item.id !== id);

    const update = await axios.patch(
      `${this.url}/${this.gistId}`,
      {
        files: {
          [`${this.projectName}.${this.schemaName}.json`]: {
            content: `${JSON.stringify(deleted)}`,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
        },
      }
    );

    // const updatedList: SchemaType<T>[] = JSON.parse(
    //   update.data.files["test.productSchema.json"].content
    // );

    return "Ok";
  }
  async findOneAndDelete(searchQuery: SchemaTypeForQuery<T>) {
    const res = await axios.get(`${this.url}/${this.gistId}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
      },
    });

    const list: SchemaType<T>[] = JSON.parse(
      res.data.files["test.productSchema.json"].content
    );

    const deleted = list.filter((item) => {
      for (let key in searchQuery) {
        return item[key] !== searchQuery[key];
      }
    });

    const update = await axios.patch(
      `${this.url}/${this.gistId}`,
      {
        files: {
          [`${this.projectName}.${this.schemaName}.json`]: {
            content: `${JSON.stringify(deleted)}`,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
        },
      }
    );

    return "Ok";
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
  // const product = await productSchema.create({
  //   name: "mouse",
  //   price: 100,
  // });

  // console.log(product);

  // console.log(
  //   await productSchema.findByIdAndUpdate(
  //     "33f3ca80-84bb-43f1-9914-97f0d19477e1",
  //     { name: "mouse", price: 55 }
  //   )
  // );
  console.log(
    await productSchema.findOneAndDelete({
      name: "mouse",
    })
  );
})();

export default DB;
