import { useEffect, useState } from "react";
import { footerElementDesktop } from "../utils/contants";
import { footerElementMobile } from "../utils/contants";

const Footer = () => {
  // isMobile will only be true, when width is less than 904
  const [isMobile, setIsMobile] = useState<Boolean>(window.innerWidth < 904);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 904);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const footerElement = isMobile ? footerElementMobile : footerElementDesktop;

  return (
    <div
      className={`flex w-[100vw]  ${
        isMobile
          ? "bg-black text-white pl-5 py-4 text-[0.8rem]"
          : "justify-center text-gray-700 border-t border-neutral-800 py-6 text-sm font-normal"
      }`}
    >
      <ul className="flex gap-4">
        {footerElement.map((item) => (
          <a href={item.url} key={item.id}>
            <li>{item.title}</li>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
