# turbopack-inline-svg-loader

A [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) loader to import SVG as optimized data URI with dimensions (width/height). The imported object can be passed directly to the Next.js `<Image />` component.

## Example

```ts
import myIcon from './icon.svg';

console.log(myIcon);

/*
Output:
{
    src: "data:image/svg+xml,<svg ...></svg>"; // SVG data url
    width: 24;                                 // detected width
    height: 24;                                // detected height
}
*/
```

## Why inline SVG?

Inlining small SVGs is beneficial because it eliminates additional HTTP requests, resulting in faster page load and instant rendering. The slight increase in JavaScript bundle is usually outweighed by the overall performance gains.

## Why not SVGR?

See [this tweet](https://x.com/_developit/status/1382838799420514317).

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

For monochrome icons you can change the color using [CSS mask technique](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images):

```tsx
return (
  <div
    style={{
      backgroundColor: `green`, // <-- set icon color explicitly, or use `currentcolor`
      mask: `url("${myIcon.src}") no-repeat center / contain`,
      width: myIcon.width,
      height: myIcon.height,
    }}
  />
);
```

To make it render via the `<img>` tag, you can create a universal `Icon` component:

```tsx
import Icon from './Icon';
import myIcon from './icon.svg';

return <Icon src={myIcon} style={{ color: 'green', width: 64, height: 64 }} />;
```

<details><summary>Icon.tsx</summary>

```tsx
import { type ComponentProps } from 'react';
import { type StaticImageData } from 'next/image';

type IconProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: StaticImageData;
};

const EMPTY_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

export default function Icon({ src, width, height, style, ...props }: IconProps) {
  return (
    <img
      width={width ?? src.width}
      height={height ?? src.height}
      {...props}
      src={EMPTY_SVG}
      style={{
        ...style,
        backgroundColor: `currentcolor`,
        mask: `url("${src.src}") no-repeat center / contain`,
      }}
    />
  );
}
```

</details>

## Feedback

Feel free to share your feedback and suggestions in the [issues](https://github.com/vitalets/turbopack-inline-svg-loader/issues).

## License

[MIT](https://github.com/vitalets/turbopack-inline-svg-loader/blob/main/LICENSE)
