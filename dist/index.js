"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary libraries
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
// Load environment variables
dotenv_1.default.config();
// Define constants
const GIST_URL = "https://api.github.com/gists";
class DB {
    // Constructor
    constructor(schema, { schemaName, projectName, gistId, timeStamps, githubToken, }) {
        this.url = GIST_URL;
        this.schema = schema;
        this.schemaName = schemaName;
        this.projectName = projectName;
        this.gistId = gistId;
        this.timeStamps = timeStamps;
        this.githubToken = githubToken;
    }
    // Helper function to handle API errors
    handleAPIError(error) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            console.error("Status:", error.response.status);
        }
        else {
            console.error("Error:", error.message);
        }
        throw error; // Rethrow the error for the caller to handle
    }
    // Helper function to fetch data from Gist
    fetchGistData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                    headers: {
                        Authorization: `Bearer ${this.githubToken}`,
                    },
                });
                return response.data;
            }
            catch (error) {
                this.handleAPIError(error);
            }
        });
    }
    // Helper function to update Gist content
    updateGistContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                    files: {
                        [`${this.projectName}.${this.schemaName}.json`]: { content },
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${this.githubToken}`,
                    },
                });
            }
            catch (error) {
                this.handleAPIError(error);
            }
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reqPayload = Object.assign(Object.assign({}, payload), { id: crypto_1.default.randomUUID() });
                if (this.timeStamps) {
                    reqPayload.createdAt = new Date().toISOString();
                    reqPayload.updatedAt = new Date().toISOString();
                }
                if (this.gistId) {
                    // get and push
                    const data = yield this.fetchGistData();
                    const list = JSON.parse(data.files[`${this.projectName}.${this.schemaName}.json`].content);
                    list.push(reqPayload);
                    const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                        files: {
                            [`${this.projectName}.${this.schemaName}.json`]: {
                                content: `${JSON.stringify(list)}`,
                            },
                        },
                    }, {
                        headers: {
                            Authorization: `Bearer ${this.githubToken}`,
                        },
                    });
                    return update.data;
                }
                else {
                    // create first object inside and array
                    const res = yield axios_1.default.post(`${this.url}`, {
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
                    }, {
                        headers: {
                            Authorization: `Bearer ${this.githubToken}`,
                        },
                    });
                    return res.data;
                }
            }
            catch (error) {
                this.handleAPIError(error);
            }
        });
    }
    findFirst(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            return list.find((item) => {
                for (let key in query) {
                    if (item[key] !== query[key]) {
                        return false;
                    }
                }
                return true;
            });
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            if (query) {
                return list.filter((item) => {
                    for (let key in query) {
                        if (item[key] !== query[key]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            else {
                return list;
            }
        });
    }
    findByIdAndUpdate(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            let updatedIndex = 0;
            list.forEach((item, index) => {
                if (item.id === id) {
                    updatedIndex = index;
                    for (let key in query) {
                        item[key] = query[key];
                    }
                    item.updatedAt = new Date().toISOString();
                }
            });
            const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                files: {
                    [`${this.projectName}.${this.schemaName}.json`]: {
                        content: `${JSON.stringify(list)}`,
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const updatedList = JSON.parse(update.data.files["test.productSchema.json"].content);
            return updatedList[updatedIndex];
        });
    }
    findOneAndUpdate(searchQuery, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            let updatedIndex = 0;
            list.forEach((item, index) => {
                for (let key in searchQuery) {
                    if (item[key] === searchQuery[key]) {
                        updatedIndex = index;
                        for (let key in query) {
                            item[key] = query[key];
                        }
                        item.updatedAt = new Date().toISOString();
                    }
                }
            });
            const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                files: {
                    [`${this.projectName}.${this.schemaName}.json`]: {
                        content: `${JSON.stringify(list)}`,
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const updatedList = JSON.parse(update.data.files["test.productSchema.json"].content);
            return updatedList[updatedIndex];
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            let updatedIndex = 0;
            const deleted = list.filter((item) => item.id !== id);
            const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                files: {
                    [`${this.projectName}.${this.schemaName}.json`]: {
                        content: `${JSON.stringify(deleted)}`,
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            // const updatedList: SchemaType<T>[] = JSON.parse(
            //   update.data.files["test.productSchema.json"].content
            // );
            return "Ok";
        });
    }
    findOneAndDelete(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            const list = JSON.parse(res.data.files["test.productSchema.json"].content);
            const deleted = list.filter((item) => {
                for (let key in searchQuery) {
                    return item[key] !== searchQuery[key];
                }
            });
            const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                files: {
                    [`${this.projectName}.${this.schemaName}.json`]: {
                        content: `${JSON.stringify(deleted)}`,
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.githubToken}`,
                },
            });
            return "Ok";
        });
    }
}
const productSchema = new DB({
    name: "String",
    price: "Number",
}, {
    githubToken: process.env.GITHUB_ACCESS_TOKEN,
    schemaName: "productSchema",
    projectName: "test",
    gistId: "48ec463b54be5973729a108297860555",
    timeStamps: true,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productSchema.create({
        name: "mouse",
        price: 100,
    });
    // console.log(product);
    // console.log(
    //   await productSchema.findByIdAndUpdate(
    //     "33f3ca80-84bb-43f1-9914-97f0d19477e1",
    //     { name: "mouse", price: 55 }
    //   )
    // );
    // console.log(
    //   await productSchema.findOneAndDelete({
    //     name: "mouse",
    //   })
    // );
}))();
exports.default = DB;
