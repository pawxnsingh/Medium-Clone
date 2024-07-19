import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";

const Carousel = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  const [tag, setTag] = useState<
    {
      id: number;
      tag: string;
    }[]
  >([]);

  useEffect(() => {
    async function getTags() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/content/tags`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTag(res.data.allTag);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    getTags();
  }, []);

  useEffect(() => {
    const handelScroll = (event: WheelEvent) => {
      if (event.shiftKey && tagContainerRef.current) {
        event.preventDefault();
        tagContainerRef.current.scrollLeft += event.deltaY;
      }
    };

    const container = tagContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handelScroll);
    }

    return () => {
      if (container) {
        container?.removeEventListener("wheel", handelScroll);
      }
    };
  }, []);

  const tagContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({ left: +200, behavior: "smooth" });
    }
  };

  return (
    // product carousal
    <div className="sticky z-50 top-0 backdrop-blur-lg">
      <div className="relative h-[55px] border-b flex items-center text-sm text-gray-600 mb-3">
        <button
          className="border-none h-[100%] absolute top-0 flex justify-center items-center outline-none  pr-[40px] bg-gradient-to-r from-white via-white/60 to-white/10"
          onClick={scrollLeft}
        >
          <IoIosArrowBack />
        </button>

        <button
          className="border-none h-[100%] absolute top-0 flex justify-center items-center right-0 outline-none pl-[50px] bg-gradient-to-l from-white via-white/60 to-white/10"
          onClick={scrollRight}
        >
          <IoIosArrowForward />
        </button>

        {/* tag container */}
        <div className="overflow-x-hidden" ref={tagContainerRef}>
          <div className="flex py-1">
            {!loading && (
              <div className="ml-11 mr-4 text-nowrap font-notosans">
                For you
              </div>
            )}

            {loading &&
              Array.from({ length: 40 }, (_, idx) => (
                <div className="mr-4 bg-gray-100 px-14 py-2" key={idx} />
              ))}

            {!loading &&
              tag?.map((item) => (
                <div className="mr-4 text-nowrap font-notosans" key={item.id}>
                  {item.tag}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
