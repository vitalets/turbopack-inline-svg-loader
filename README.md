# turbopack-inline-svg-loader

A [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) loader to import SVG as optimized data URI with dimensions. The imported object has the same shape as external assets `{ src, width, height }` and can be passed directly to the Next.js `<Image />` component.

## Example

```ts
import myIcon from './icon.svg';

return <Image src={myIcon} alt="my icon" />;

// Renders:
// <img width="..." height="..." src="data:image/svg+xml,<svg ...></svg>" />
```

## Why inline SVG?

Inlining small SVGs is beneficial because it eliminates additional HTTP requests, resulting in faster page load and instant rendering. The slight increase in JavaScript bundle is usually outweighed by the overall performance gains.

## Why not SVGR?

Check [this article](https://kurtextrem.de/posts/svg-in-js).

## Installation

Install via any package manager:

```sh
# NPM
npm i -D turbopack-inline-svg-loader

# PNPM
pnpm add -D turbopack-inline-svg-loader

# Yarn
yarn add -D turbopack-inline-svg-loader
```

## Configuration

Add the loader configuration to the `next.config.js`:

```ts
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['turbopack-inline-svg-loader'],
        condition: {
          content: /^[\s\S]{0,2000}$/, // <-- Inline SVGs smaller than ~2Kb
        },
        as: '*.js',
      },
    },
  },
  // ...
};
```

## Usage

Statically import SVG file and pass it to the `<Image/>` component:

```tsx
import Image from 'next/image';
import myIcon from './icon.svg';

export default function Page() {
  return <Image src={myIcon} alt="my icon" />;
}
```

### How to change size?

You can change image size via CSS `style` or `className`:

```tsx
// Set size via style
return <Image src={myIcon} style={{ width: 64, height: 64 }} alt="my icon" />;

// Set size with Tailwind
return <Image src={myIcon} className="size-64" alt="my icon" />;
```

### How to change color?

For monochrome icons you can change the color using [CSS mask technique](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images). To achieve it, create a helper component `Icon.tsx` that renders SVG as a mask:

```tsx
import { type ComponentProps } from 'react';
import { type StaticImageData } from 'next/image';

type IconProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: StaticImageData;
};

const EMPTY_SVG = 'data:image/svg+xml,%3Csvg/%3E';

export default function Icon({ src, width, height, style, ...props }: IconProps) {
  return (
    <img
      width={width ?? src.width}
      height={height ?? src.height}
      src={EMPTY_SVG}
      style={{
        ...style,
        backgroundColor: `currentcolor`,
        mask: `url("${src.src}") no-repeat center / contain`,
      }}
      {...props}
    />
  );
}
```

Now you can render colored icons:

```tsx
import Icon from './Icon';
import myIcon from './icon.svg';

// Set color with style
return <Icon src={myIcon} style={{ color: 'green' }} />;

// Set color with Tailwind
return <Icon src={myIcon} className="text-green-600" />;
```

## TypeScript

By default, Next.js imports `*.svg` assets [as `any` type](https://github.com/vercel/next.js/blob/v16.0.3/packages/next/image-types/global.d.ts#L16) to avoid conflicts with SVGR. To make `*.svg` imported like other images `{ src, widht, height }` you can create the following `svg.d.ts` file in the project root:

```ts
declare module '*.svg' {
  const content: import('next/image').StaticImageData;
  export default content;
}
```

and add it to the `tsconfig.json` before `next-env.d.ts`:

```diff
"include": [
+  "svg.d.ts",
  "next-env.d.ts",
  ...
],
```

## References

- [Breaking Up with SVG-in-JS](https://kurtextrem.de/posts/svg-in-js)

## Feedback

Feel free to share your feedback and suggestions in the [issues](https://github.com/vitalets/turbopack-inline-svg-loader/issues).

## License

[MIT](https://github.com/vitalets/turbopack-inline-svg-loader/blob/main/LICENSE)
