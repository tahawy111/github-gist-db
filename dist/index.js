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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DB {
    // Constructor
    constructor(schema, { schemaName, projectName, gistId, timeStamps, }) {
        // Properties
        this.url = "https://api.github.com/gists";
        this.schema = schema;
        this.schemaName = schemaName;
        this.projectName = projectName;
        this.gistId = gistId;
        this.timeStamps = timeStamps;
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqPayload = Object.assign(Object.assign({}, payload), { id: crypto.randomUUID() });
            if (this.timeStamps) {
                reqPayload.createdAt = new Date().toISOString();
                reqPayload.updatedAt = new Date().toISOString();
            }
            if (this.gistId) {
                // get and push
                const res = yield axios_1.default.get(`${this.url}/${this.gistId}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    },
                });
                const list = JSON.parse(res.data.files["test.productSchema.json"].content);
                list.push(reqPayload);
                const update = yield axios_1.default.patch(`${this.url}/${this.gistId}`, {
                    files: {
                        [`${this.projectName}.${this.schemaName}.json`]: {
                            content: `${JSON.stringify(list)}`,
                        },
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
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
                        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    },
                });
                return res.data;
            }
        });
    }
}
const productSchema = new DB({
    name: "String",
    price: "Number",
}, {
    schemaName: "productSchema",
    projectName: "test",
    gistId: "48ec463b54be5973729a108297860555",
    timeStamps: true,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productSchema.create({
        id: "uuid",
        name: "Product Name",
        price: 100,
    });
    console.log(product);
}))();
