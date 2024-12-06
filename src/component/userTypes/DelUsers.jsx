import React, { useContext, useState } from "react";
import { DeletedUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { LuChevronsUpDown } from "react-icons/lu";
const DelUsers = () => {
  const { handleSelectAll, handleUserSelect, selectedUsers, selectAll } =
    useContext(UserContext);
  const [isOpenOptions, setIsOpenOptions] = useState({});
  
  const toggleOptions = (index) => {
    setIsOpenOptions(prevState => ({
      ...prevState,
      [index]: !prevState[index] 
    }));
  };
  return (
    <div>
      <div className="table-container">
        <table className="custom-table font-san text-[14px]">
          <thead>
            <tr>
              <th>
                <input
                  className=""
                  type="checkbox"
                  name="guest"
                  id="guest-checkbox"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
              </th>
              <th>
                <div className="flex items-center gap-1">
                  S/N
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  User ID
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Name
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Email
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Deletion date
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Reason
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          {DeletedUsers.map((data, index) => (
            <tbody className="relative" key={data.id}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="guest"
                    id="guest-checkbox"
                    onChange={() => {
                      handleUserSelect(data.id);
                    }}
                    checked={selectedUsers.includes(data.id)}
                  />
                </td>
                <td>{data.id}</td>
                <td>{data.userId}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.deletionDate}</td>
                <td>{data.reason}</td>
                <td>
                  {isOpenOptions[index] && (
                    <div className=" rounded-lg  text-white bg-[#292929] w-[120px] border-[1px] border-white absolute top-10 right-10  z-10">
                      <p className="border-b-[1px] border-gray-300 p-2">
                        View profile
                      </p>
                      <p className="p-2 text-[#E53935]">Delete</p>
                    </div>
                  )}
                  <i
                    onClick={()=>{toggleOptions(index)}}
                  >
                    <MdOutlineMoreHoriz />
                  </i>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default DelUsers;
