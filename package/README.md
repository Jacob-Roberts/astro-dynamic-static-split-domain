# `astro-dynamic-static-split-domain`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to split the domains that your static content and dynamic content are served on

## Usage

### Prerequisites

This may work with all astro deployment adapters,
but this was designed to work with the node adapter.

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
