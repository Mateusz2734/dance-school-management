# `backend`

## Overview

This is a simple auth POC. It currently uses sqlite as database (it can be changed to any supported database later) and in-memory cache as secondary storage. It 

## How to use

Install all dependencies, rename `example.env` to `.env` and run the following commands:

```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate

npx tsc && node dist/app.js
```

Now it should be running on `http://localhost:8080`. OpenAPI docs of `better-auth` are available at `http://localhost:8080/api/auth/reference`

You can test behaviour with frontend app. To do so, run the following commands in the `frontend` directory:

```bash
pnpm dev
```

Open `http://localhost:3000/register` in your browser to see registration process.
Then open `http://localhost:3000/login` to see login process.
