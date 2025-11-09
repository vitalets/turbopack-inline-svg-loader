import Image from 'next/image';
import Icon from './Icon';
import myIcon from './icon.svg';

export default function Home() {
  return (
    <>
      <div className="border p-4">
        <h3>Image:</h3>
        <Image src={myIcon} className="size-32" alt="my icon" />
      </div>
      <div className="border p-4">
        <h3>Colored:</h3>
        <Icon src={myIcon} className="size-32 text-green-600" alt="my icon" />
      </div>
    </>
  );
}
