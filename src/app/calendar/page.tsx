import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import CalendarBox from "@/components/Filter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Calendar" />

      {/* <CalendarBox /> */}
    </>
  );
};

export default CalendarPage;
