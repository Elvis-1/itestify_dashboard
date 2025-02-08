import React, { useContext, useState, useMemo } from "react";
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

const DonationsAnalytics = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const { isDarkMode } = useContext(DarkModeContext);
  const { userDonation } = useContext(DonationsContext);
  const [dateRange, setRangeDate] = useState({
    from: "",
    to: "",
  });

  // Get verified donations
  const approvedDonations = useMemo(
    () =>
      userDonation.filter((dona) => dona.status === "Verified" && dona.amount),
    [userDonation]
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
        acc[date] = {
          date,
          amount: 0,
        };
      }
      acc[date].amount += donation.amount;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(groups).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [approvedDonations]);

  return (
    <div className="p-5">
      <div className="flex w-full justify-between items-center pb-5">
        <p>Analytics</p>
        <input
          className={`bg-off-black rounded-md pl-2 p-1 w-[200px] placeholder:text-off-black ${
            isDarkMode ? "bg-off-black" : "bg-off-white"
          } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
          placeholder="Yesterday (Nov 15 ,2024)"
          type="date"
        />
      </div>
      <div className="flex items-center justify-between w-full gap-10 pb-4">
        <div
          className={`w-1/2 rounded-xl p-2 ${
            isDarkMode
              ? "bg-grayBlack text-white"
              : "bg-white text-black border"
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
            isDarkMode
              ? "bg-grayBlack text-white"
              : "bg-white text-black border"
          }`}
        >
          <p className="text-[13px] pl-3">Total Donors</p>
          <hr className="w-[95%] m-[auto] mt-1" />
          <p className="text-[13px] pl-3 pt-3">{approvedDonations.length}</p>
        </div>
      </div>
      <div className="bg-grayBlack p-5 rounded-lg h-[380px] pb-12 w-full mb-72 object-cover">
        <p>Donations</p>
        <Line
          data={{
            labels: groupedDonations.map((dona) => dona.date),
            datasets: [
              {
                label: "",
                data: groupedDonations.map((dona) => dona.amount),
                backgroundColor: "#9966CC",
                borderColor: "#9966CC",
                borderWidth: 1,
                
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  color: "transparent",
                  marginLeft: "200px"
                },
                ticks: {
                  color: isDarkMode ? "#fff" : "#000",
                },
              },
              y: {
                grid: {
                  color: isDarkMode ? "#575757" : "#000",
                },
                ticks: {
                  color: isDarkMode ? "#fff" : "#000",
                  stepSize: 20000,
                  callback: (value) => `₦${value.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DonationsAnalytics;
