import axios from "axios";

export const getCombinedReservation = async (target) => {
  try {
    const { data: homepageReserved } = await axios.get(`/api/reservation/${target}`);
    const { data: airbnbReserved } = await axios.get(`/api/ical/${target}`);

    return [
      ...homepageReserved.map(el => ({
        checkin_date: new Date(new Date(el.checkin_date).toISOString().slice(0, -1)).toString(),
        checkout_date: new Date(new Date(el.checkout_date).toISOString().slice(0, -1)).toString(),
      })),
      ...airbnbReserved.map(el => ({
        checkin_date: new Date(new Date(el.start_dt).toISOString().slice(0, -1)).toString(),
        checkout_date: new Date(new Date(el.end_dt).toISOString().slice(0, -1)).toString(),
      })),
    ];
  } catch (err) {
    console.error(`예약 데이터 불러오기 실패 (${target}):`, err);
    throw err;
  }
};

export const getHomepageReservation = async (target) => {
  try {
    const { data } = await axios.get(`/api/reservation/${target}`);
    return data.map(el => ({
      checkin_date: new Date(new Date(el.checkin_date).toISOString().slice(0, -1)).toString(),
      checkout_date: new Date(new Date(el.checkout_date).toISOString().slice(0, -1)).toString(),
    }));
  } catch (err) {
    console.error(`홈페이지 예약 데이터 불러오기 실패 (${target}):`, err);
    throw err;
  }
};