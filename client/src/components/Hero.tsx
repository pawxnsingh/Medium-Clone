import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="relative mt-[9rem] md:mt-[8rem]">
      <div className="flex">
        <div className="px-5 py-6 lg:px-20 lg:py-14">
          <h1 className="text-8xl font-serif lg:text-9xl ">Human stories & ideas</h1>
          <p className="text-[1.4rem] leading-[1.5rem] font-semibold text-gray-800 mt-6">
            A Plave to read, write, and deepen your understanding
          </p>
          <div className="mt-9">
            <Link to={"/signin"}>
              <button className="py-3 px-[3rem] bg-black pb-3 text-white rounded-full font-semibold">
                Start Reading
              </button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
            alt="asbract images"
            height={100}
            className="max-h-[60rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
