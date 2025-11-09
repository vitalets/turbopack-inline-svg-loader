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
