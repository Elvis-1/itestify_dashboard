
// const ExportCsv = () => {
//   const [userType, setUserType] = useState("registered");

//     const handleExportCSV = () => {
//   let data = [];

//   if (userType === "registered") {
//     data = JSON.parse(localStorage.getItem("registeredUsers")) || [];
//   } else if (userType === "deleted") {
//     data = JSON.parse(localStorage.getItem("deletedUsers")) || [];
//   } else if (userType === "deactivated") {
//     data = JSON.parse(localStorage.getItem("deactivatedUsers")) || [];
//   }

//   if (!data.length) {
//     alert("No data available to export.");
//     return;
//   }

//   const headers = Object.keys(data[0]);
//   const rows = data.map((user) => headers.map((key) => user[key]));

//   const csvContent =
//     "data:text/csv;charset=utf-8," +
//     [headers, ...rows].map((e) => e.join(",")).join("\n");

//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", `${userType}_users.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };
//   return (
//     <div>
//            <button
//       onClick={handleExportCSV}
//       className="text-xs border-2 border-[#9966CC] hover:bg-[#663380] hover:text-white text-[#9966CC] py-2 px-4 rounded-lg transition-all duration-200"
//     >
//       Export as CSV file
//     </button>
//     </div>
//   )
// }

// export default ExportCsv