import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({
  children,
  disableOnHash = true,
}) => {
  const location = useLocation();

  useEffect(() => {
    if (disableOnHash && location.hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.hash, disableOnHash]);

  return <>{children}</>;
};

export default ScrollToTop;