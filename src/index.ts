// Import necessary libraries
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define constants
const GIST_URL = "https://api.github.com/gists";

// Define types and interfaces
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

type SchemaTypeForQuery<T> = Partial<SchemaType<T>>;

class DB<T extends SchemaTypes> {
  // Properties
  private readonly url: string;
  private readonly schema: T;
  private readonly schemaName: string;
  private readonly projectName: string;
  private readonly gistId?: string;
  private readonly timeStamps?: boolean;
  private readonly githubToken: string;
  private readonly dbFileName: string;

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
    this.url = GIST_URL;
    this.schema = schema;
    this.schemaName = schemaName;
    this.projectName = projectName;
    this.gistId = gistId;
    this.timeStamps = timeStamps;
    this.githubToken = githubToken;
    this.dbFileName = `${this.projectName}.${this.schemaName}.json`;
  }

  // Helper function to handle API errors
  private handleAPIError(error: AxiosError) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error:", error.message);
    }
    throw error; // Rethrow the error for the caller to handle
  }
  // Helper function to fetch data from Gist
  private async fetchGistData() {
    try {
      const response = await axios.get(`${this.url}/${this.gistId}`, {
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  //
  private async PrepareGistBeforeRequestTheFile() {
    try {
      const checkData = await this.fetchGistData();
      const files = checkData.files;

      for (const fileName of Object.keys(files)) {
        if (fileName !== this.dbFileName) {
          await this.updateGistFile();
        }
      }
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  // Helper function for PrepareGistBeforeRequestTheFile function
  private async updateGistFile() {
    const headers = {
      Authorization: `Bearer ${this.githubToken}`,
    };

    const gistData = {
      description: `
            Project: ${this.projectName}
            && Schema: ${this.schemaName}
        `,
      public: false,
      files: {
        [this.dbFileName]: {
          content: "[]",
        },
      },
    };

    try {
      await axios.patch(
        `https://api.github.com/gists/${this.gistId}`,
        gistData,
        { headers }
      );
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  // Helper function to update Gist content
  private async updateGistContent(content: string) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const response = await axios.patch(
        `${this.url}/${this.gistId}`,
        {
          files: {
            [this.dbFileName]: { content },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  private getList(data: any): SchemaType<T>[] {
    const list: SchemaType<T>[] = JSON.parse(
      data.files[this.dbFileName].content
    );
    return list;
  }
  async create(payload: SchemaType<T>) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
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
        const data = await this.fetchGistData();

        const list = this.getList(data);

        list.push(reqPayload);

        const update = this.getList(
          await this.updateGistContent(JSON.stringify(list))
        );

        return update.find((item) => item.id === reqPayload.id);
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
              [this.dbFileName]: {
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
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findFirst(query: SchemaTypeForQuery<T>) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const data = await this.fetchGistData();

      const list: SchemaType<T>[] = JSON.parse(
        data.files[this.dbFileName].content
      );

      return list.find((item) => {
        for (let key in query) {
          if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findMany(query?: SchemaTypeForQuery<T>) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const data = await this.fetchGistData();

      const list: SchemaType<T>[] = JSON.parse(
        data.files[this.dbFileName].content
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
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findByIdAndUpdate(id: string, query: SchemaTypeForQuery<T>) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const data = await this.fetchGistData();

      const list: SchemaType<T>[] = JSON.parse(
        data.files[this.dbFileName].content
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

      const update = await this.updateGistContent(JSON.stringify(list));

      const updatedList: SchemaType<T>[] = JSON.parse(
        update.files[this.dbFileName].content
      );

      return updatedList[updatedIndex];
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findOneAndUpdate(
    searchQuery: SchemaTypeForQuery<T>,
    query: SchemaTypeForQuery<T>
  ) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const data = await this.fetchGistData();

      const list: SchemaType<T>[] = JSON.parse(
        data.files[this.dbFileName].content
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

      const update = await this.updateGistContent(JSON.stringify(list));

      const updatedList: SchemaType<T>[] = JSON.parse(
        update.files[this.dbFileName].content
      );

      return updatedList[updatedIndex];
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findByIdAndDelete(id: string) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const res = await axios.get(`${this.url}/${this.gistId}`, {
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
        },
      });

      const list: SchemaType<T>[] = JSON.parse(
        res.data.files[this.dbFileName].content
      );

      const deleted = list.filter((item) => item.id !== id);

      await this.updateGistContent(JSON.stringify(deleted));

      return "Ok";
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
  async findOneAndDelete(searchQuery: SchemaTypeForQuery<T>) {
    try {
      await this.PrepareGistBeforeRequestTheFile();
      const data = await this.fetchGistData();

      const list: SchemaType<T>[] = JSON.parse(
        data.files[this.dbFileName].content
      );

      const deleted = list.filter((item) => {
        for (let key in searchQuery) {
          return item[key] !== searchQuery[key];
        }
      });

      await this.updateGistContent(JSON.stringify(deleted));

      return "Ok";
    } catch (error: any) {
      this.handleAPIError(error);
    }
  }
}

export { DB };

// const productSchema = new DB(
//   {
//     name: "String",
//     price: "Number",
//   },
//   {
//     githubToken: process.env.GITHUB_ACCESS_TOKEN!,
//     schemaName: "productSchema",
//     projectName: "test",
//     gistId: "48ec463b54be5973729a108297860555",
//     timeStamps: true,
//   }
// );

// (async () => {
//   // const product = await productSchema.create({
//   //   name: "laptop lenovo",
//   //   price: 500,
//   // });
//   // console.log(product);
//   console.log(
//     await productSchema.findOneAndDelete({id:"479a474b-a668-4407-8543-adcae24d9f91"})
//   );
//   // console.log(await productSchema.findMany());
//   // console.log(await productSchema.PrepareGistBeforeRequestTheFile());
// })();
