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

  return (
    <div className={`p-5 ${isDarkMode ? "bg-black" : "bg-off-white"}`}>
      <div className="flex w-full justify-between items-center pb-5">
        <p>Analytics</p>
        <DateRangePicker
          showOneCalendar
          format="dd.MM.yyyy"
          character="-"
          caretAs={IoMdArrowDropdown}
          defaultValue={[dateRange.from, dateRange.to]}
          value={[dateRange.from, dateRange.to]}
          onChange={(range) => setRangeDate({ from: range[0], to: range[1] })}
          limitEndYear={new Date().getFullYear()}
          onClean={(range) => setRangeDate({ from: null, to:null })}
          ranges={[
            {
              label: "Last 1 year",
              value: [addDays(new Date(), -700), new Date()],
              placement: "bottom",
            },
            {
              label: "Last 1 month",
              value: [addDays(new Date(), -31), new Date()],
              placement: "bottom",
            },
          ]}
          className={
            isDarkMode
              ? "rs-theme-dark bg-off-black"
              : "rs-theme-light bg-white"
          }
        />
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
        className={`p-5 rounded-lg h-[380px] pb-12 w-full mb-72 object-cover ${
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
