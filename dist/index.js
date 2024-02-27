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
function createGist() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.post("https://api.github.com/gists", {
            description: "test gist",
            public: false,
            files: {
                "sell_goods.categories.json": {
                    content: `[{
            "_id": {
              "$oid": "62a4b27ab3a6b9868cbb5cbc"
            },
            "category": "الكل",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51711b3a6b9868cbb5d55"
            },
            "category": "اكسسوارات",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51725b3a6b9868cbb5d5f"
            },
            "category": "هاردوير",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51743b3a6b9868cbb5d69"
            },
            "category": "ميموري & فلاشات",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51761b3a6b9868cbb5d73"
            },
            "category": "اجهزة النت والشبكات",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a5178eb3a6b9868cbb5d7d"
            },
            "category": "لاب توب",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a517c1b3a6b9868cbb5d87"
            },
            "category": "لاب توب استعمال",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a517e9b3a6b9868cbb5d97"
            },
            "category": "كاميرات المراقبه",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51814b3a6b9868cbb5da1"
            },
            "category": "الاسلاك",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a5182db3a6b9868cbb5dae"
            },
            "category": "اجهزة الدش",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a5187ab3a6b9868cbb5dbe"
            },
            "category": "اكسسوارات الكمبيوتر ",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a5188cb3a6b9868cbb5dd0"
            },
            "category": "اكسسوارات الموبايل",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a518f5b3a6b9868cbb5dda"
            },
            "category": "الخدمات والصيانه",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a5191cb3a6b9868cbb5dea"
            },
            "category": "الشاشات",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51c31b3a6b9868cbb5e0b"
            },
            "category": "ريموت كنترول",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a51cd8b3a6b9868cbb5e2d"
            },
            "category": "الاجهزه والاكسسوارات الاورجينال",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62a523a2b3a6b9868cbb5e9c"
            },
            "category": "الصبات والاسبيكرات",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62ab5d9bb7771fa3d4e495a0"
            },
            "category": "الكهرباء",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62c4ad2f4db3cca2fe8f03f3"
            },
            "category": "هاردوير كمبيوتر",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "62d2bd68dce409cb3f5520bb"
            },
            "category": "كمبيوتر استيراد",
            "__v": 0
          },
          {
            "_id": {
              "$oid": "63362743d4290815875a6d38"
            },
            "category": "اكسسوارات البلايستيشن",
            "__v": 0
          }]`,
                },
            },
        }, { headers: {
                Authorization: "Bearer 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"
            } });
        console.log(res.data);
    });
}
createGist();
