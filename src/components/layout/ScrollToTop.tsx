import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // Instant is best for page changes so it doesn't animate up from the footer
    });
  }, [pathname]);

  return null;
}
