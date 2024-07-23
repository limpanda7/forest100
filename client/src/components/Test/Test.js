import {Link, useLocation} from "react-router-dom";
import {useEffect} from "react";

const Test = () => {

  const location = useLocation();

  useEffect(() => {
    if (window.decibelInsight) {
      window.decibelInsight('trackPageView', document.location.pathname + document.location.hash.replace("#", ""), {fragment: ""});
    }
  }, [location]);

  return (
    <>
      <Link to='/test'>
        <button>move to test</button>
      </Link>
      <Link to='/test#/1234'>
        <button>move to test#/1234</button>
      </Link>
      <Link to='/test#/5678'>
        <button>move to test#/5678</button>
      </Link>
    </>
  );
}

export default Test;