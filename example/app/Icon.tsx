/**
 * A component for rendering monochrome SVG icons using the current text color.
 *
 * @example
 * import Icon from './Icon';
 * import myIcon from './icon.svg';
 *
 * <Icon src={myIcon} style={{ color: 'green' }} />
 */
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
