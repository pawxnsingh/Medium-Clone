import { Link } from "react-router-dom";
import Button from "./Button";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full bg-[#f7f4ed] font-notosans">
      {/* this is the top half of header */}
      <div className="flex relative items-center justify-between py-4 mx-5 md:mx-16 md:py-5">
        {/* this is start - this is logo heading */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-3xl font-extrabold font-serif">Quillfire</h1>
          </Link>
        </div>

        {/* this is middle */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* this is end */}
        <div className="flex items-center">
          <Link
            to={"/signin"}
            className="hidden md:block mr-6 font-medium hover:underline"
          >
            Signin
          </Link>
          <Link to={"/signup"}>
            <Button>Get started</Button>
          </Link>
        </div>
      </div>

      {/* this is below half of the header */}
      <div className="border relative py-4 md:py-3 border-t-black border-b-black bg-gradient-to-r from-amber-200 to-yellow-500">
        <p className="flex flex-col mx-5  md:flex-row md:justify-center">
          <span className="font-bold mr-1">Be part of a better internet.</span>
          <Link to="/signin" className="underline">
            Get 20% off membership for a limited time
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Header;
