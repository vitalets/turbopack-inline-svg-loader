# turbopack-inline-svg-loader

[![npm version](https://img.shields.io/npm/v/turbopack-inline-svg-loader)](https://www.npmjs.com/package/turbopack-inline-svg-loader)
[![license](https://img.shields.io/github/license/vitalets/turbopack-inline-svg-loader)](https://github.com/vitalets/turbopack-inline-svg-loader/blob/main/license)

A [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) loader for importing SVGs as optimized data URIs with dimensions. The imported object has the same shape as external image (`{ src, width, height }`) and can be passed directly to the Next.js `<Image />` component.

## Example

```ts
import myIcon from './icon.svg';

return <Image src={myIcon} alt="my icon" />;

/*
myIcon is an object like:
{
  src: 'data:image/svg+xml,...',
  width: 32,
  height: 32,
}
*/
```

## Why inline SVG?

Inlining small SVGs is beneficial because it eliminates additional HTTP requests, resulting in faster page loads and instant rendering. The slight increase in JavaScript bundle size is usually outweighed by the overall performance gains.

## Why not SVGR?

Check out [this article](https://kurtextrem.de/posts/svg-in-js).

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

Add the loader configuration to `next.config.js`.
Since **Next.js v16**, you can [conditionally](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#advanced-webpack-loader-conditions) apply a loader only to SVGs smaller than a given size:

```ts
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['turbopack-inline-svg-loader'],
        condition: {
          content: /^[\s\S]{0,4000}$/, // <-- Inline SVGs smaller than ~4Kb (since Next.js v16)
        },
        as: '*.js',
      },
    },
  },
  // ...
};
```

## Usage

Statically import an SVG file and pass it to the `<Image/>` component:

```tsx
import Image from 'next/image';
import myIcon from './icon.svg';

export default function Page() {
  return <Image src={myIcon} alt="my icon" />;
}
```

### How to change size?

You can change the image size via the CSS `style` prop or `className`:

```tsx
// Set size via style
return <Image src={myIcon} style={{ width: 64, height: 64 }} alt="my icon" />;

// Set size with Tailwind
return <Image src={myIcon} className="size-64" alt="my icon" />;
```

### How to change color?

For monochrome icons, you can change the color using the [CSS mask technique](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images). Set the background color and apply image as a mask:

<img width="50%" alt="CSS masking" src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fshpd8mbat8bqfx1m26zu.png"/>

To achieve this, render `<img>` tag with empty SVG and propper CSS styles:

```jsx
<img
  src={EMPTY_SVG}
  style={{
    backgroundColor: `currentcolor`,
    mask: `url("${src}") no-repeat center / contain`,
  }}
/>
```

Here's a reusable universal `Icon.tsx` component, that renders icon with current or original color:

````tsx
/**
 * A component for rendering static icons in Next.js apps.
 *
 * Usage:
 * ```tsx
 * import myIcon from './myIcon.svg';
 *
 * // Render with current text color
 * <Icon src={myIcon} width={32} height={32} />
 *
 * // Render with original icon colors
 * <Icon src={myIcon} nofill width={32} height={32} />
 * ```
 */
import { type ComponentProps } from 'react';
import { type StaticImageData } from 'next/image';

type IconProps = Omit<ComponentProps<'img'>, 'src'> & {
  /* Icon path and dimensions */
  src: StaticImageData;
  /* Disables filling with the current color and renders the original icon colors */
  nofill?: boolean;
};

const EMPTY_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E`;

export function Icon({ src, nofill, width, height, alt, style, ...props }: IconProps) {
  const mainSrc = nofill ? src.src : EMPTY_SVG;
  width ??= src.width;
  height ??= src.height;
  alt ??= 'icon';
  style = nofill
    ? style
    : {
        ...style,
        backgroundColor: `currentcolor`,
        mask: `url("${src.src}") no-repeat center / contain`,
      };

  return <img src={mainSrc} width={width} height={height} alt={alt} style={style} {...props} />;
}
````

> You can copy & paste this component to your project as is.

Now you can render colored icons:

```tsx
import Icon from './Icon';
import myIcon from './icon.svg';

// Set color with style
return <Icon src={myIcon} style={{ color: 'green' }} />;

// Set color with Tailwind
return <Icon src={myIcon} className="text-green-600" />;

// Or keep original colors with `nofill` prop
return <Icon nofill src={myIcon} />;
```

## TypeScript

By default, Next.js imports `*.svg` assets [as the `any` type](https://github.com/vercel/next.js/blob/v16.0.3/packages/next/image-types/global.d.ts#L16) to avoid conflicts with SVGR. To make `*.svg` imports behave like other images (`{ src, width, height }`), create the following `svg.d.ts` file in the project root:

```ts
declare module '*.svg' {
  const content: import('next/image').StaticImageData;
  export default content;
}
```

and add it to `tsconfig.json` before `next-env.d.ts`:

```diff
"include": [
+ "svg.d.ts",
  "next-env.d.ts",
  ...
],
```

Now your SVG imports will be resolved as `{ src, width, height }`.

## References

A short background article [How I arrived at this package](https://dev.to/vitalets/turbopack-a-better-way-to-inline-svg-in-nextjs-16-36em).

Some other resources to dive deep into the rabbit hole of SVGs:

- [A guide to using SVGs in React](https://blog.logrocket.com/guide-svgs-react)
- [Breaking Up with SVG-in-JS](https://kurtextrem.de/posts/svg-in-js)
- [Introducing @svg-use](https://fotis.xyz/posts/introducing-svg-use/)

## Feedback

Feel free to share your feedback and suggestions in the [issues](https://github.com/vitalets/turbopack-inline-svg-loader/issues).

## License

[MIT](https://github.com/vitalets/turbopack-inline-svg-loader/blob/main/LICENSE)
