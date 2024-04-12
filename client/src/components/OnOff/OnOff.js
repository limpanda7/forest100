import React, {useEffect, useState} from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import "react-calendar/dist/Calendar.css";
import OnOffReservation from "./OnOffReservation";
import OnOffIntro from "./OnOffIntro";
import OnOffCalendar from "./OnOffCalendar";
import { Link } from "react-router-dom";
import cn from "classnames";
import OnOffReview from "./OnOffReview";

const OnOff = () => {
  const [currentPage, setCurrentPage] = useState("intro");
  const [reserved, setReserved] = useState([]);
  const [picked, setPicked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    const {data: homepageReserved} = await axios.get("/api/reservation/on_off");
    const {data: airbnbReserved} = await axios.get("/api/ical/on_off");

    let tempReserved = [];
    for (const element of homepageReserved) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.checkin_date).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.checkout_date).toISOString().slice(0, -1)
        ).toString(),
      });
    }
    for (const element of airbnbReserved) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.start_dt).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.end_dt).toISOString().slice(0, -1)
        ).toString(),
      });
    }
    setReserved(tempReserved);
    setIsLoading(false);
  };

  const goToHome = () => {
    setCurrentPage("calendar");
    setPicked([]);
  };

  return (
    <div className="OnOff">
      <Helmet>
        <title>::: 온오프스테이 :::</title>
      </Helmet>

      <div className="header">
        {currentPage !== "reservation" ? (
          <>
            <Link className="BackWrap" to="/">
              ◀
            </Link>
            <div className="Path">ON OFF 스테이</div>
          </>
        ) : (
          <div className="BackWrap" onClick={() => goToHome()}>
            ◀<span className="Back">뒤로가기</span>
          </div>
        )}
      </div>

      {currentPage !== "reservation" && (
        <div className="tabs">
          <div
            className={cn("Tab", { Active: currentPage === "intro" })}
            onClick={() => setCurrentPage("intro")}
          >
            소개
          </div>
          <div
            className={cn("Tab", { Active: currentPage === "calendar" })}
            onClick={() => setCurrentPage("calendar")}
          >
            예약하기
          </div>
        </div>
      )}

      {currentPage === "intro" && <OnOffIntro />}
      {currentPage === "calendar" && (
        <OnOffCalendar
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          reserved={reserved}
        />
      )}
      {currentPage === "reservation" && (
        <OnOffReservation
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "review" && <OnOffReview />}
    </div>
  );
};

export default OnOff;
