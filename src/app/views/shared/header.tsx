import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full bg-[#140C22] backdrop-blur p-4">
      <Image src="/images/fuku-logo.png" alt="header" width={120} height={36} />
    </div>
  );
};

export default Header;
