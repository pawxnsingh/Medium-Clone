import {
  footerElementDesktop,
  recentlySaved,
  recommendedTopics,
  staffPick,
} from "../../utils/contants";
import premiumstar from "../../assets/premiumstar.svg";

const Sidepanel = () => {
  return (
    <div className="hidden lg:block max-w-[368px] border-l border-gray-200 px-10 py-3.5 font-notosans  top-0">
      {/* staff pick section */}
      <h1 className="font-bold mb-5">Staff Picks</h1>
      <div className="">
        {staffPick.map((item) => (
          <div key={item.id} className="mb-5">
            {/* heading and publication */}
            <div className="flex gap-[0.4rem] items-center text-xs mb-1">
              <img
                src={item.profilePicture}
                className="rounded-full"
                width={20}
                height={20}
                alt="profile picture"
              />
              <h1 className="font-semibold">{item.name}</h1>
              {item.publication && (
                <>
                  <h1 className="text-gray-500">in</h1>
                  <h1 className="font-semibold">
                    <span>{item.publication}</span>
                  </h1>
                </>
              )}
            </div>
            {/* title of the article */}
            <div>
              <h1 className="font-bold">{item.title}</h1>
            </div>
          </div>
        ))}
        <button className="text-xs text-green-700">See the full list</button>
      </div>

      {/* Recommened topics */}
      <h1 className="font-bold mt-10 mb-5">Recommended topics</h1>
      <div className=" flex flex-wrap gap-2 mb-5">
        {recommendedTopics.map((item) => (
          <div
            key={item.id}
            className="text-xs py-3 px-4 bg-gray-100 font-medium rounded-full"
          >
            {item.title}
          </div>
        ))}
        <button className="text-xs text-green-700 mt-5">See more topic</button>
      </div>

      {/* recently saved */}
      <h1 className="font-bold mt-10 mb-5">Recently saved</h1>
      <div className="">
        {recentlySaved.map((item) => (
          <div key={item.title} className="mb-5">
            {/* heading and publication */}
            <div className="flex gap-[0.4rem] items-center text-xs mb-1">
              <img
                src={item.image}
                className="rounded-full"
                width={20}
                height={20}
                alt="profile picture"
              />
              <h1 className="font-semibold">{item.author}</h1>
              {item.publication && (
                <>
                  <h1 className="text-gray-500">in</h1>
                  <h1 className="font-semibold">
                    <span>{item.publication}</span>
                  </h1>
                </>
              )}
            </div>
            {/* title of the article */}
            <div>
              <h1 className="font-medium mb-2">{item.title}</h1>
            </div>
            <div className="text-xs flex items-center gap-2">
              <h1>{item.date}</h1>
              &#x2022;
              <h1>{item.read_time}</h1>
              {item.is_featured && (
                <img src={premiumstar} width={15} alt="medium star" />
              )}
            </div>
          </div>
        ))}
        <button className="text-xs text-green-700">See the full list</button>
      </div>
      {/* footer */}
      <div className="mt-5 flex flex-wrap text-xs">
        {footerElementDesktop.map((item) => (
          <a href={item.url} className="mr-2" key={item.id}>
            <div key={item.id} className="text-gray-500">
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidepanel;
