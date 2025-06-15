import React, {useEffect, useState} from "react";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import OnOffReservation from "./OnOffReservation";
import OnOffIntro from "./OnOffIntro";
import OnOffCalendar from "./OnOffCalendar";
import {Link, useNavigate} from "react-router-dom";
import cn from "classnames";
import OnOffReview from "./OnOffReview";
import Header from "../Header/Header";
import {getCombinedReservation, getHomepageReservation} from "../../utils/reservation";

const OnOff = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [reserved, setReserved] = useState([]);
  const [picked, setPicked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  console.log(reserved)
  const getReserved = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const data = await getHomepageReservation("on_off");
      setReserved(data);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (currentPage === 'reservation') {
      setCurrentPage('calendar');
      setPicked([]);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="OnOff">
      <Header
        title='온오프스테이'
        handleGoBack={handleGoBack}
      />

      {currentPage !== "reservation" && (
        <div className="tabs">
          <div
            className={cn("Tab", { Active: currentPage === 'intro' })}
            onClick={() => setCurrentPage('intro')}
          >
            소개
          </div>
          <div
            className={cn("Tab", { Active: currentPage === "calendar" })}
            onClick={() => setCurrentPage("calendar")}
          >
            계약하기
          </div>
          <div
            className={cn("Tab", { Active: currentPage === "review" })}
            onClick={() => setCurrentPage("review")}
          >
            이용후기
          </div>
        </div>
      )}

      {currentPage === 'intro' && <OnOffIntro />}
      {currentPage === "calendar" && (
        <OnOffCalendar
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
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
