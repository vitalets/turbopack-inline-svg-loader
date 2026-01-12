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

export default function Icon({ src, nofill, width, height, alt, style, ...props }: IconProps) {
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
