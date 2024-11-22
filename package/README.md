# `astro-dynamic-static-split-domain`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to split the domains that your static content and dynamic content are served on

## Usage

### Prerequisites

This may work with all astro deployment adapters,
but this was designed to work with the node adapter.

This project is ESM only!

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-dynamic-static-split-domain
```

```bash
npx astro add astro-dynamic-static-split-domain
```

```bash
yarn astro add astro-dynamic-static-split-domain
```

```bash
bunx astro add astro-dynamic-static-split-domain
```

Or install it **manually**:

1. Install the required dependencies

    ```bash
    pnpm add astro-dynamic-static-split-domain
    ```

    ```bash
    npm install astro-dynamic-static-split-domain
    ```

    ```bash
    yarn add astro-dynamic-static-split-domain
    ```

    ```bash
    bun add astro-dynamic-static-split-domain
    ```

2. Add the integration to your astro config

    ```diff
    +import dynamicStaticSplitDomain from "astro-dynamic-static-split-domain";

    export default defineConfig({
      integrations: [
    +    dynamicStaticSplitDomain(),
      ],
    });
    ```

### Configuration

There is only a single option to configure this integration:

`dynamicBase`

```js
dynamicStaticSplitDomain({
  dynamicBase: "https://api.myastrosite.com"
})
```

## Deployment

This project has a specific deployment goal, that of having two separate servers running, one for static files,
and one for dynamic endpoints.

This can be accomplished many different ways. This project only does one thing: **change the build output to point server islands to the correct base url**.

However, that being said, a good deployment pattern would be to have two separate servers, deployed as docker containers.
Then put the static server behind a CDN that operates as a proxy (ie: Cloudflare).

Here are some example Dockerfiles that you can use to get started

```Dockerfile
# Dynamic Dockerfile
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS runtime
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist

# run the app
USER bun
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp
ENTRYPOINT [ "bun", "run", "./dist/server/entry.mjs" ]
```

```Dockerfile
# Static Dockerfile
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM nginx:alpine AS runtime
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=prerelease /usr/src/app/dist/client /usr/share/nginx/html
EXPOSE 8080
```

With an nginx.conf of the following:

```nginx
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  server {
    listen 8080;
    server_name   _;

    root   /usr/share/nginx/html;
    index  index.html index.htm;
    include /etc/nginx/mime.types;

    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    error_page 404 /404.html;
    location = /404.html {
            root /usr/share/nginx/html;
            internal;
    }

    location / {
            try_files $uri $uri/index.html =404;
    }
  }
}
```

This should help you get started on deploying two separate servers.

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/Jacob-Roberts/astro-dynamic-static-split-domain/blob/main/package/LICENSE). Made with ❤️ by [Jacob-Roberts](https://github.com/Jacob-Roberts).
