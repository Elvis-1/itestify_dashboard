import React, { useContext } from "react";
import { DeletedUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
const DelUsers = () => {
  const {
    handleSelectAll,
    handleItemSelect,
    selectedItems,
    selectAll
  } = useContext(UserContext);
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
              <th>S/N</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Deletion date</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          {DeletedUsers.map((data) => (
            <tbody>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="guest"
                    id="guest-checkbox"
                    onChange={() => {
                      handleItemSelect(data.id);
                    }}
                    checked={selectedItems.includes(data.id)}
                  />
                </td>
                <td>{data.id}</td>
                <td>{data.userId}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.deletionDate}</td>
                <td>{data.reason}</td>
                <td>
                  <MdOutlineMoreHoriz />
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
