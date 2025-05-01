import React, { useContext, useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DarkModeContext } from "../context/DarkModeContext";
import { DonationsContext } from "../context/DonationContext";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { IoMdArrowDropdown } from "react-icons/io";
import noData from "../assets/images/No-data.png";
import noDataLightMode from "../assets/images/Nodata-lightmode.png";
import { addDays } from "date-fns";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DonationsAnalytics = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { userDonation } = useContext(DonationsContext);
  const [dateRange, setRangeDate] = useState({ from: null, to: null });
  const [filteredDonations, setFilteredDonations] = useState(userDonation);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const filtered = userDonation.filter((dona) => {
        const donationDate = new Date(dona.date);
        return donationDate >= dateRange.from && donationDate <= dateRange.to;
      });
      setFilteredDonations(filtered);
    } else {
      setFilteredDonations(userDonation);
    }
  }, [dateRange, userDonation]);

  // Get verified donations
  const approvedDonations = useMemo(
    () =>
      filteredDonations.filter(
        (dona) => dona.status === "Verified" && dona.amount
      ),
    [filteredDonations]
  );

  // Calculate total donations
  const totalDonations = useMemo(
    () =>
      approvedDonations.reduce((total, donation) => total + donation.amount, 0),
    [approvedDonations]
  );

  // Group donations by date and sum amounts
  const groupedDonations = useMemo(() => {
    const groups = approvedDonations.reduce((acc, donation) => {
      const date = new Date(donation.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += donation.amount;
      return acc;
    }, {});

    // Convert to array and sort correctly
    return Object.values(groups).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [approvedDonations]);

  const predefinedRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "This week",
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: "left",
    },
    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: "left",
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },
    {
      label: "All time",
      value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
      placement: "left",
    },
    {
      label: "Clear",
      value: null,
      placement: "left",
    },
  ];

  return (
    <div className={`p-5 ${isDarkMode ? "bg-black" : "bg-off-white"}`}>
      <div className="flex w-full justify-between items-center pb-5">
        <p>Analytics</p>
        <div className="mr-28">
          <DateRangePicker
            showOneCalendar
            format="dd.MM.yyyy"
            character="-"
            caretAs={IoMdArrowDropdown}
            defaultValue={[dateRange.from, dateRange.to]}
            value={[dateRange.from, dateRange.to]}
            onChange={(range) => setRangeDate({ from: range[0], to: range[1] })}
            limitEndYear={new Date().getFullYear()}
            ranges={predefinedRanges}
            className={ 
              isDarkMode ? "rs-theme-dark " : "rs-theme-light"
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full gap-10 pb-4">
        <div
          className={`w-1/2 rounded-xl p-2 ${
            isDarkMode ? "bg-grayBlack text-white" : "bg-white text-black "
          }`}
        >
          <p className="text-[13px] pl-3">Total Donations</p>
          <hr className="w-[95%] m-[auto] mt-1" />
          <p className="text-[13px] pl-3 pt-3">
            ₦{totalDonations.toLocaleString()}
          </p>
        </div>
        <div
          className={`w-1/2 rounded-xl p-2 ${
            isDarkMode ? "bg-grayBlack text-white" : "bg-white text-black "
          }`}
        >
          <p className="text-[13px] pl-3">Total Donors</p>
          <hr className="w-[95%] m-[auto] mt-1" />
          <p className="text-[13px] pl-3 pt-3">{approvedDonations.length}</p>
        </div>
      </div>

      <div
        className={`p-5 rounded-lg h-[380px] pb-12 w-full object-cover ${
          isDarkMode ? "bg-grayBlack" : "bg-white"
        }`}
      >
        <p>Donations</p>

        {approvedDonations.length > 0 ? (
          <Line
            data={{
              labels: groupedDonations.map((dona) => dona.date),
              datasets: [
                {
                  label: "Donation Amount",
                  data:
                    groupedDonations.length < 1
                      ? "null"
                      : groupedDonations.map((dona) => dona.amount),
                  backgroundColor: "#9966CC",
                  borderColor: "#9966CC",
                  borderWidth: 1,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { color: "transparent" },
                  ticks: { color: isDarkMode ? "#fff" : "#000" },
                },
                y: {
                  grid: { color: isDarkMode ? "#575757" : "#9A9A9A" },
                  ticks: {
                    color: isDarkMode ? "#fff" : "#000",
                    stepSize: 20000,
                    callback: (value) => `₦${value.toLocaleString()}`,
                  },
                },
              },
            }}
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-64 opacity-70 ${
              isDarkMode ? "text-off-white" : "text-off-black "
            }`}
          >
            <img
              src={isDarkMode ? noData : noDataLightMode}
              width={100}
              height={100}
              alt=""
            />

            <p className="text-sm text-center max-w-sm pt-12">
              There are no donations recorded for the selected date range. Try
              selecting a different time period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsAnalytics;
