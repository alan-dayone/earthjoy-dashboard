const contentContainer = (props: {
  children: JSX.Element[] | JSX.Element,
  className?: string,
}) => {
  const { children, className } = props;

  return (
    <div
      className={`p--10 m--0 d-flex flex__grow row align__content--star ${className}`}
    >
      {children}
    </div>
  );
};

export { contentContainer as ContentContainer };
