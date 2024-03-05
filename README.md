<h1 align="center">Welcome to Github-Gist-DB 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/github-gist-db" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/github-gist-db.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Unlimited GitHub Gist DB is a lightweight NoSQL database package for Node.js, designed to store JSON data in GitHub Gists, providing CRUD operations and more.
> Because it depends on the gists and Github says that you can create an unlimted gists and unlimited requests 🤑 for free.

### 🏠 [Homepage](https://github.com/tahawy111/github-gist-db#readme)

# Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Learn](#learn)

- [Create Method](#CreateMethod)
- [FindMany Method ](#FindManyMethod)
- [findFirst Method ](#findFirstMethod)
- [findByIdAndUpdate Method ](#findByIdAndUpdateMethod)
- [findOneAndUpdate Method ](#findOneAndUpdateMethod)
- [findByIdAndDelete Method ](#findByIdAndDeleteMethod)
- [findOneAndDelete Method ](#findOneAndDeleteMethod)

4. [License](#license)

<br/>
<br/>
<a name="installation"></a>

## Install

```sh
npm install github-gist-db
```

<br/>
<br/>
 <a name="usage"></a>

## Usage

```typescript
import { DB } from "github-gist-db";

// Define your schema
interface Product {
  name: string;
  price: number;
}

// Initialize the database
const productSchema = new DB<Product>(
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

// Example usage
(async () => {
  const product = await productSchema.create({
    name: "laptop lenovo",
    price: 500,
  });
  console.log(product);

  const updatedProduct = await productSchema.findOneAndUpdate(
    { name: "iphone 15 pro max" },
    { name: "laptop Dell", price: 800 }
  );
  console.log(updatedProduct);

  const deletionStatus = await productSchema.findByIdAndDelete(
    "33a66454-fc9a-4016-bc01-45731fc16be3"
  );
  console.log(deletionStatus);
})();
```

<br/>
<br/>

## Learn <a name="learn"></a>

> First you have to define the Schema (the body of your database)

```typescript
import { DB } from "github-gist-db";

// Define your schema
interface Product {
  name: string;
  price: number;
}

// Initialize the database
const productSchema = new DB<Product>(
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
1`
 {
    name: "String",
    price: "Number",
  },
  this is the fields and its types of your database
  you can define many fields as you want.
  And here is the types you can create with
    | "String"
    | "Number"
    | "Boolean"
    | "Object"
    | "Array"
    | "Undefined"
    | "Null"
    | "Symbol"
    | "BigInt"
`;
```

2. `githubToken: process.env.GITHUB_ACCESS_TOKEN!.
your github access token you can create it in you Developer Settings`

![alt text](https://i.imgur.com/fZbzItn.png?1)
![alt text](https://i.imgur.com/7No4dws.png)
![alt text](https://i.imgur.com/7No4dws.png)
![alt text](https://i.imgur.com/Ok1pkQe.png)
![alt text](https://i.imgur.com/XriJ5W4.png)

`Only Check Gist`
![alt text](https://i.imgur.com/MSXZFyb.png)

And then click Generate Token
![alt text](https://i.imgur.com/Rbp7baO.png)

`This is your github Token`

![alt text](https://i.imgur.com/85BXM3M.png)

> timeStamps: true 3. `timeStamps: true, will add CreatedAt and updatedAT in your schema. whenever you create a new Document Example (new product)
`
> Example ` createdAt: '2024-03-04T12:35:52.641Z',
  updatedAt: '2024-03-04T12:35:52.643Z'`

<br/>
<br/>
<a name="CreateMethod"></a>

> Create Method

```typescript
const product = await productSchema.create({
  name: "laptop lenovo",
  price: 500,
});
console.log(product);
/*
  {
  name: 'laptop lenovo',
  price: 500,
  id: '16f1a00f-5527-4783-a966-29355aa5a9de',
  createdAt: '2024-03-04T12:35:52.641Z',
  updatedAt: '2024-03-04T12:35:52.643Z'
  }
  */
```
<br/>
<br/>
<a name="FindManyMethod"></a>

> FindMany Method

```typescript
console.log(await productSchema.findMany());
/*
  [
  {
    name: 'laptop lenovo',
    price: 500,
    id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
    createdAt: '2024-03-04T13:30:25.984Z',
    updatedAt: '2024-03-04T13:30:25.986Z'
  },
  {
    name: 'laptop lenovo',
    price: 500,
    id: '479a474b-a668-4407-8543-adcae24d9f91',
    createdAt: '2024-03-04T13:31:08.447Z',
    updatedAt: '2024-03-04T13:31:08.449Z'
  }
]
  */
```
<br/>
<br/>
 <a name="findFirstMethod"></a>

> findFirst Method

```typescript
console.log(await productSchema.findMany());
/*
  [
  {
    name: 'laptop lenovo',
    price: 500,
    id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
    createdAt: '2024-03-04T13:30:25.984Z',
    updatedAt: '2024-03-04T13:30:25.986Z'
  },
  {
    name: 'laptop lenovo',
    price: 500,
    id: '479a474b-a668-4407-8543-adcae24d9f91',
    createdAt: '2024-03-04T13:31:08.447Z',
    updatedAt: '2024-03-04T13:31:08.449Z'
  }
]
  */
```

<br/>
<br/>
<a name="findByIdAndUpdateMethod"></a>

> findByIdAndUpdate Method

```typescript
console.log(
  await productSchema.findByIdAndUpdate(
    "29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7",
    { name: "laptop Dell", price: 800 }
  )
);
/*
Before:
  {
    "name": "laptop lenovo",
    "price": 500,
    "id": "29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7",
    "createdAt": "2024-03-04T13:30:25.984Z",
    "updatedAt": "2024-03-04T13:30:25.986Z"
  }

  After:
  {
  name: 'laptop Dell',
  price: 800,
  id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
  createdAt: '2024-03-04T13:30:25.984Z',
  updatedAt: '2024-03-05T21:54:15.440Z'
  }
  */
```

<br/>
<br/>
 <a name="findOneAndUpdateMethod"></a>

> findOneAndUpdate Method

```typescript
console.log(
  await productSchema.findByIdAndUpdate(
    "29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7",
    { name: "laptop Dell", price: 800 }
  )
);
/*
Before:
  {
  name: 'laptop Dell',
  price: 800,
  id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
  createdAt: '2024-03-04T13:30:25.984Z',
  updatedAt: '2024-03-05T21:54:15.440Z'
  }

  After:
  {
  name: 'laptop Dell 2',
  price: 800,
  id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
  createdAt: '2024-03-04T13:30:25.984Z',
  updatedAt: '2024-03-05T21:58:24.302Z'
  }
  */
```

<br/>
<br/>
<a name="findByIdAndDeleteMethod"></a>

> findByIdAndDelete Method

```typescript
console.log(
  await productSchema.findByIdAndUpdate(
    "29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7",
    { name: "laptop Dell", price: 800 }
  )
);
/*
Before:
  {
    name: 'laptop Dell 2',
    price: 800,
    id: '29ad41de-b015-4d96-a9d4-1a5c5a4a4ec7',
    createdAt: '2024-03-04T13:30:25.984Z',
    updatedAt: '2024-03-05T21:58:24.302Z'
  }

  After:
 Response "Ok"
  */
```

<br/>
<br/>
> findOneAndDelete Method <a name="findOneAndDeleteMethod"></a>

```typescript
  console.log(
    await productSchema.findOneAndDelete({id:"479a474b-a668-4407-8543-adcae24d9f91"})
  );
/*
Before:
  {
    "name": "laptop lenovo",
    "price": 500,
    "id": "479a474b-a668-4407-8543-adcae24d9f91",
    "createdAt": "2024-03-04T13:31:08.447Z",
    "updatedAt": "2024-03-04T13:31:08.449Z"
  }

  After:
 Response "Ok"
  */
```

## Author

👤 **ElTahawy**

- Website: https://tahawy.vercel.app/
- Github: [@tahawy111](https://github.com/tahawy111)
- LinkedIn: [@amer-eltahawy](https://linkedin.com/in/amer-eltahawy)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/tahawy111/github-gist-db/issues).

## Show your support

Give a ⭐️ if this project helped you!

<br/>
<br/>
## 📝 License <a name="license"></a>

Copyright © 2024 [Amer Eltahawy](https://github.com/tahawy111).<br />
This project is [MIT](https://github.com/tahawy111/github-gist-db/LICENSE) licensed.

---
