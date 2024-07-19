const Button = ({ children, className }: any) => {
  return (
    <div
      className={`py-1 px-[1rem]  bg-black pb-2 text-white rounded-full ${className}`}
    >
      <button className="text-sm font-semibold">{children}</button>
    </div>
  );
};

export default Button;
