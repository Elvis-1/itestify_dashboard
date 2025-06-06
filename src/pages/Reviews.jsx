import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { DarkModeContext } from "../context/DarkModeContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import modalpic from "../assets/images/modalPic.png";
import { message, Modal } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from "axios";
import { MdOutlineMoreHoriz } from "react-icons/md";
import LoadingState from "../component/LoadingState";

function Reviews() {
  const { isDarkMode } = useContext(DarkModeContext);

  const [reviewData, setReviewData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [page, setPage] = useState(1);
  const [getFilteredData, setGetFilterData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [reviewFilterModal, setReviewFilterModal] = useState(false);
  const [reviewActionModal, setReviewActionModal] = useState(false);
  const [reviewViewModal, setReviewViewModal] = useState(false);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [reviewDeleteModal, setReviewDeleteModal] = useState(false);
  const [reviewDeleteAllModal, setReviewDeleteAllModal] = useState(false);
  const [filterDropDown, setFilterDropDown] = useState(false);
  const [filterDate1, setFilterDate1] = useState("");
  const [filterDate2, setFilterDate2] = useState("");
  const [ratingType, setRatingType] = useState(0);
  const token = localStorage.getItem("token");
  const itemsPerPage = 6;

  const [loadingReviews, setLoadingReviews] = useState(true);

  const startIndex = (page - 1) * itemsPerPage;
  const totalPages = Math.ceil(
    (getFilteredData.length > 0 ? getFilteredData : reviewData).length /
      itemsPerPage
  );
  const sortData = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const searchedData = useMemo(() => {
    const dataToSearch =
      getFilteredData.length > 0 ? getFilteredData : reviewData;

    if (searchQuery.trim() !== "") {
      return dataToSearch.filter(
        (item) =>
          item.user_full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.user_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return dataToSearch;
  }, [getFilteredData, reviewData, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;

    return [...searchedData].sort((a, b) => {
      const key = sortConfig.key;
      const valueA = a[key];
      const valueB = b[key];

      if (key === "created_at") {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [searchedData, sortConfig]);

  const hasCheckedItems = Object.values(checkedItems).some(Boolean);
  const singleChecked =
    Object.values(checkedItems).filter(Boolean).length === 1;
  const allChecked =
    sortedData.length > 0 &&
    sortedData?.slice(startIndex, startIndex + itemsPerPage)
      .every((item) => checkedItems[item.id]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  function handleCloseModal() {
    setReviewActionModal(false);
    setReviewViewModal(false);
    setReviewDeleteModal(false);
    setReviewDeleteAllModal(false);
    setReviewFilterModal(false);
  }

  function handleDetail(item) {
    setReviewDetails(item);
  }

  const dateInputRef1 = useRef(null);
  const dateInputRef2 = useRef(null);
  const handleFromDateIconClick = () => {
    dateInputRef1.current?.showPicker();
  };

  const handleToDateIconClick = () => {
    dateInputRef2.current?.showPicker();
  };

  function handleFilterDate1(event) {
    setFilterDate1(event.target.value);
  }

  function handleFilterDate2(event) {
    setFilterDate2(event.target.value);
  }

  function handleFiltering() {
    const filteredData = reviewData.filter((item) => {
      const itemDate = new Date(item.created_at);
      const startDate = filterDate1 ? new Date(filterDate1) : null;
      const endDate = filterDate2 ? new Date(filterDate2) : null;

      const isWithinDateRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate.setHours(23, 59, 59, 999));

      const matchesRating = ratingType === 0 || item.rating === ratingType;

      return isWithinDateRange && matchesRating;
    });

    setGetFilterData(filteredData);
    setReviewFilterModal(false);
    setPage(1); // Reset to first page after filtering
  }

  function handleReset() {
    setRatingType(0);
    setFilterDate1("");
    setFilterDate2("");
    setGetFilterData([]);
    setPage(1);
  }

  const fetchReviewData = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/review/admin/reviews/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviewData(response.data.results);
    } catch (error) {
      console.error("Error fetching review data:", error);
      message.error(error?.message || "Failed to fetch reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, []);

  const DeleteReview = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/review/admin/reviews/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviewData((prevData) =>
        prevData.filter((review) => review.id !== id)
      );
      setGetFilterData((prevData) =>
        prevData.filter((review) => review.id !== id)
      );
      setCheckedItems((prev) => {
        const newChecked = { ...prev };
        delete newChecked[id];
        return newChecked;
      });
      setReviewDeleteModal(false);
      setReviewActionModal(false);
      message.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review");
    }
  };

  const DeleteAllReviews = async () => {
    try {
      const checkedIds = Object.keys(checkedItems).filter(
        (id) => checkedItems[id]
      );
      if (checkedIds.length === 0) {
        message.error("No reviews selected for deletion");
        return;
      }

      await Promise.all(
        checkedIds.map((id) =>
          axios.delete(
            `${import.meta.env.VITE_API_URL}/review/admin/reviews/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setReviewData((prevData) =>
        prevData.filter((review) => !checkedIds.includes(String(review.id)))
      );
      setGetFilterData((prevData) =>
        prevData.filter((review) => !checkedIds.includes(String(review.id)))
      );
      setCheckedItems({});
      setReviewDeleteAllModal(false);
      message.success("Selected reviews deleted successfully");
    } catch (error) {
      console.error("Error deleting reviews:", error);
      message.error("Failed to delete reviews");
    }
  };

  return (
    <div
      className={`w-[98%] flex flex-col justify-between m-[auto] mt-8 ${
        isDarkMode ? "bg-[#171717]" : "bg-white"
      } rounded-xl`}
    >
      {/* filter modal */}
      <Modal
        open={reviewFilterModal}
        onCancel={handleCloseModal}
        footer={null}
        closeIcon={
          <span
            style={{ color: "white", fontSize: "12px", marginTop: "-15px" }}
          >
            X
          </span>
        }
        styles={{
          content: {
            backgroundColor: "#0B0B0B",
            width: "330px",
            height: "auto",
            color: "white",
            margin: "0 auto",
            borderRadius: "8px",
            marginLeft: "100%",
            marginTop: "50px",
          },
          body: {
            backgroundColor: "#1717171",
            color: "white",
          },
        }}
      >
        <div className="p-2">
          <h3 className="text-white text-[13px] font-sans pb-2 mt-[-10px]">
            Filter
          </h3>
          <hr className="opacity-[0.2] text-gray-300 w-[124%] ml-[-31px] " />

          <div className="flex items-center justify-between mt-2 w-[115%] ml-[-15px]">
            <h3 className="text-[14px]">Rating</h3>
            <button
              onClick={() => setRatingType(0)}
              className="outline-none border-none p-1 text-[#9966CC] rounded"
            >
              Clear
            </button>
          </div>

          <div
            onClick={() => setFilterDropDown(!filterDropDown)}
            className="flex items-center justify-center w-[115%] ml-[-20px] bg-[#171717] p-1 rounded-xl cursor-pointer"
          >
            <p className="text-white font-sans p-1 w-[100%] rounded flex items-center">
              {ratingType === 0
                ? "Select"
                : [...Array(ratingType)].map((_, i) => (
                    <AiFillStar className="text-[#9966CC]" key={i} />
                  ))}
              {ratingType < 5 &&
                [...Array(5 - ratingType)].map((_, i) => (
                  <AiOutlineStar className="text-[#9966CC]" key={i} />
                ))}
            </p>
            {filterDropDown ? <FaCaretUp /> : <FaCaretDown />}
          </div>

          {filterDropDown && (
            <div className="flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[115%] ml-[-20px]">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  onClick={() => {
                    setRatingType(rating);
                    setFilterDropDown(false);
                  }}
                  className="w-[110%] ml-[-15px] border-b pl-5 pb-1"
                  key={rating}
                >
                  <div className="flex item-center">
                    {[...Array(rating)].map((_, i) => (
                      <AiFillStar className="text-[#9966CC]" key={i} />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <AiOutlineStar className="text-[#9966CC]" key={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="opacity-[0.2] mt-5 text-gray-300 w-[124%] ml-[-31px] " />

          <div>
            <div className="flex items-center justify-between mb-[-15px] mt-2 w-[110%] ml-[-15px]">
              <h3 className="text-[14px]">Date Range</h3>
              <button
                onClick={() => {
                  setFilterDate1("");
                  setFilterDate2("");
                }}
                className="outline-none border-none p-1 text-[#9966CC] rounded"
                bang
              >
                Clear
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 gap-2 ml-[-10px]">
              <div>
                <p>From</p>
                <div className="flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer">
                  <CalendarOutlined
                    onClick={handleFromDateIconClick}
                    className="text-white ml-2"
                  />
                  <input
                    type="date"
                    ref={dateInputRef1}
                    placeholder="dd/mm/yyyy"
                    value={filterDate1}
                    onChange={handleFilterDate1}
                    className="no-icon border cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <p>To</p>
                <div className="flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer">
                  <CalendarOutlined
                    onClick={handleToDateIconClick}
                    className="text-white ml-2"
                  />
                  <input
                    type="date"
                    ref={dateInputRef2}
                    placeholder="dd/mm/yyyy"
                    value={filterDate2}
                    onChange={handleFilterDate2}
                    className="no-icon border cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[50px] flex items-center justify-end">
            <button
              onClick={handleReset}
              className="border border-[#9966CC] outline-none p-1 rounded w-[100px] text-[#9966CC]"
            >
              Clear All
            </button>
            <button
              onClick={handleFiltering}
              className="bg-[#9966CC] ml-2 border-none outline-none rounded p-1 w-[100px]"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={reviewActionModal}
        onCancel={handleCloseModal}
        footer={null}
        closeIcon={null}
        styles={{
          content: {
            backgroundColor: isDarkMode ? "#171717" : "white",
            width: "120px",
            height: "auto",
            color: isDarkMode ? "white" : "black",
            margin: "0 auto",
            borderRadius: "8px",
            marginLeft: "125%",
            marginTop: "100px",
          },
          body: {
            backgroundColor: "#1717171",
          },
        }}
      >
        <div
          className={`flex flex-col ${
            isDarkMode ? "bg-[#171717]" : "bg-white"
          }`}
        >
          <div className="border-b w-[170%] ml-[-25px] opacity-[0.6]">
            <button
              onClick={() => {
                setReviewViewModal(true);
                setReviewActionModal(false);
              }}
              className="pl-2 pb-2"
            >
              View
            </button>
          </div>

          <div className="w-[150%] ml-[-25px] opacity-[0.6] cursor-pointer">
            <button
              onClick={() => {
                setReviewDeleteModal(true);
                setReviewActionModal(false);
              }}
              className="pl-2 pt-2 text-red"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={reviewViewModal}
        onCancel={handleCloseModal}
        footer={null}
        closable={true}
        closeIcon={
          <span
            style={{
              color: isDarkMode ? "white" : "black",
              fontSize: "18px",
              fontWeight: "300",
              position: "absolute",
              top: "15px",
              right: "15px",
            }}
          >
            ✕
          </span>
        }
        styles={{
          content: {
            backgroundColor: "#2a2a2a",
            width: "380px",
            height: "auto",
            margin: "0 auto",
            borderRadius: "20px",
            padding: "0",
          },
          body: {
            backgroundColor: "#2a2a2a",
            padding: "0",
            borderRadius: "20px",
          },
        }}
      >
        {reviewDetails && (
          <div
            style={{ padding: "0", position: "relative" }}
            className={`${isDarkMode ? "bg-[#171717]" : "bg-white text-black"}`}
          >
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "2px",
                height: "40px",
                borderLeft: "2px dotted #4A90E2",
                zIndex: 1,
              }}
            ></div>

            <div className="flex justify-center pt-8 pb-4">
              <div
                className="w-[80px] h-[80px] rounded-full border-4 border-white overflow-hidden"
                style={{ position: "relative", zIndex: 2 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={modalpic}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="mx-4 mb-6 rounded-lg p-4 bg">
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-1">Email Address</p>
                <p
                  className={`${
                    isDarkMode ? `text-white` : `text-black`
                  } text-sm font-medium`}
                >
                  {reviewDetails.user_email}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-1">Name</p>
                <p
                  className={`${
                    isDarkMode ? `text-white` : `text-black`
                  } text-sm font-medium`}
                >
                  {reviewDetails.user_full_name}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-1">Date</p>
                <p
                  className={`${
                    isDarkMode ? `text-white` : `text-black`
                  } text-sm`}
                >
                  {new Date(reviewDetails.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Rating</p>
                <div className="flex">
                  {[...Array(reviewDetails.rating)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className="text-purple-400 text-lg mr-1"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 pb-6">
              <div className="flex items-center mb-3">
                <h3
                  className={`${
                    isDarkMode ? `text-white` : `text-black`
                  } font-medium text-sm mr-3`}
                >
                  Review
                </h3>
              </div>
              <p
                className={`${
                  isDarkMode ? `text-white` : `text-black`
                } text-sm leading-relaxed`}
              >
                {reviewDetails.message}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={reviewDeleteModal}
        onCancel={handleCloseModal}
        closeIcon={
          <span
            style={{
              color: isDarkMode ? "white" : "black",
              fontSize: "12px",
              marginTop: "-30px",
            }}
          >
            X
          </span>
        }
        footer={null}
        styles={{
          content: {
            backgroundColor: isDarkMode ? "black" : "white",
            width: "350px",
            height: "auto",
            color: isDarkMode ? "white" : "black",
            margin: "0 auto",
            borderRadius: "8px",
            marginTop: "50px",
          },
          body: {
            backgroundColor: "#1717171",
            color: isDarkMode ? "white" : "black",
          },
        }}
      >
        <div className="flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center">
          <div>
            <p className="text-[20px] text-center pt-1">Delete Review?</p>
            <p className="text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]">
              Are you sure you want to delete this review? This action cannot be
              undone
            </p>
          </div>
        </div>

        <div className="w-[335px] mt-5 flex items-center justify-end pr-3">
          <button
            onClick={handleCloseModal}
            className="border border-[#9966CC] outline-none text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => reviewDetails && DeleteReview(reviewDetails.id)}
            className="border-none outline-none bg-red w-[100px] rounded p-1 mr-2 pl-3"
          >
            Yes delete
          </button>
        </div>
      </Modal>

      <Modal
        open={reviewDeleteAllModal}
        onCancel={handleCloseModal}
        closeIcon={
          <span
            style={{ color: "white", fontSize: "12px", marginTop: "-30px" }}
          >
            X
          </span>
        }
        footer={null}
        styles={{
          content: {
            backgroundColor: "black",
            width: "350px",
            height: "auto",
            color: "white",
            margin: "0 auto",
            borderRadius: "8px",
            marginTop: "50px",
          },
          body: {
            backgroundColor: "#1717171",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center">
          <div className="w-[80%] ml-[-45px]">
            <p className="text-[20px] text-center pt-1">Delete Reviews?</p>
            <p className="text-[15px] text-center pt-3">
              Are you sure you want to delete all selected reviews? This action
              cannot be undone
            </p>
          </div>
        </div>

        <div className="w-[335px] mt-5 flex items-center justify-end pr-3">
          <button
            onClick={handleCloseModal}
            className="border border-[#9966CC] outline-none text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2"
          >
            Cancel
          </button>
          <button
            onClick={DeleteAllReviews}
            className="border-none outline-none bg-red w-[100px] rounded p-1 mr-2 pl-3"
          >
            Yes delete
          </button>
        </div>
      </Modal>

      <div
        className={`flex items-center justify-between p-3 ${
          isDarkMode
            ? "text-white"
            : "bg-white text-black border-b border-b-slate-200"
        }`}
      >
        <div className={`flex items-center gap-5 cursor-pointer`}>
          <h3>Reviews</h3>
        </div>
        <div className="flex gap-2">
          {hasCheckedItems && (
            <button
              onClick={() => setReviewDeleteAllModal(true)}
              className="p-2 text-[12px] rounded-xl w-[110px] cursor-pointer bg-red text-white"
            >
              Delete
            </button>
          )}
          <div
            className={`p-1 text-[12px] rounded-xl flex items-center gap-1 ${
              isDarkMode
                ? "bg-[#313131] text-white"
                : "bg-white text-black border border-slate-200"
            }`}
          >
            <CiSearch size={20} />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              type="search"
              placeholder="Search by name, Email Address"
              className={`w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
          </div>

          <div className="flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]">
            <IoFilterOutline />
            <button
              onClick={() => setReviewFilterModal(true)}
              className="text-[12px] outline-none border-none"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {loadingReviews ? (
        <LoadingState />
      ) : (
        <div>
          <div
            className={`w-[100%] h-[240px] m-[auto] ${
              isDarkMode ? "bg-[#171717]" : "bg-white"
            } overflow-hidden`}
          >
            <div
              className={`h-10 grid grid-cols-8 text-[11px] ${
                isDarkMode
                  ? "bg-[#313131] text-white"
                  : "bg-slate-100 text-black border-b border-b-slate-200"
              }`}
            >
              <div className="p-2 flex items-center">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={allChecked}
                  onChange={() => {
                    const newCheckedState = allChecked
                      ? {}
                      : Object.fromEntries(
                          sortedData?.slice(startIndex, startIndex + itemsPerPage)
                            .map((item) => [item.id, true])
                        );
                    setCheckedItems(newCheckedState);
                  }}
                />
              </div>

              <div className="p-2 flex items-center">
                Review ID
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("id")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("id")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-2 flex items-center ml-[-15px]">
                Name
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("user_full_name")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("user_full_name")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-2 flex items-center">
                Email Address
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("user_email")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("user_email")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 flex items-center">
                Reviews
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("message")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("message")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 flex items-center">
                Ratings
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("rating")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("rating")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-2 flex items-center">
                Date Submitted
                <div className="flex flex-col">
                  <IoIosArrowUp
                    onClick={() => sortData("created_at")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                  <IoIosArrowDown
                    onClick={() => sortData("created_at")}
                    size={10}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 flex items-center">Action</div>
            </div>

            {sortedData.length > 0 ? (
              sortedData?.slice(startIndex, startIndex + itemsPerPage)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`border-b border-white text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-8 ${
                      isDarkMode
                        ? "text-white"
                        : "bg-white text-black border-b border-b-slate-200"
                    }`}
                  >
                    <div className="p-2 flex items-center">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={checkedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </div>
                    <div className="p-2 flex items-center">{item.id}</div>
                    <div className="p-2 flex items-center ml-[-10px]">
                      <p>{item.user_full_name || "--- ---"}</p>
                    </div>
                    <div className="pl-2 flex items-center">
                      {item.user_email || "------"}
                    </div>
                    <div className="pl-2 flex items-center">
                      {item.message || "------"}
                    </div>
                    <div className="p-2 flex items-center">
                      {[...Array(item.rating)].map((_, i) => (
                        <AiFillStar key={i} className="text-[#9966CC]" />
                      ))}
                    </div>
                    <div className="p-2 flex items-center">
                      {new Date(item.created_at).toLocaleDateString() ||
                        "------"}
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetail(item);
                        setReviewActionModal(true);
                      }}
                      className="p-2 flex items-center ml-3"
                    >
                      <MdOutlineMoreHoriz />
                    </div>
                  </div>
                ))
            ) : (
              <div className="h-[240px] m-[auto] flex items-center justify-center">
                <div className="p-2 flex items-center">No Data here Yet</div>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`flex justify-between items-center mt-6 pb-6 ${
          isDarkMode ? "bg-[#171717]" : "bg-white"
        }`}
      >
        <div className={`text-[12px] ml-[10px]`}>
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
          {sortedData.length}
        </div>
        <div className="text-[13px] mr-5 flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`w-[90px] p-2 rounded-xl ${
              page === 1
                ? "opacity-[0.5] text-gray-500 border border-gray-500"
                : "border border-[#9966CC] text-[#9966CC]"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`w-[90px] p-2 rounded-xl ${
              page === totalPages
                ? "opacity-[0.5] text-gray-500 border border-gray-500"
                : "border border-[#9966CC] text-[#9966CC]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
