import Image from "next/image";
import BackgroundImage from "@/public/page_bg.svg";

const Background = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <Image
        src={BackgroundImage}
        alt="shape"
        width={500}
        height={500}
        className="w-full"
      />
    </div>
  );
};

export default Background;
