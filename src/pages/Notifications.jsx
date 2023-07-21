import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { useTable } from "react-table";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        id: "index",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Content",
        accessor: "content",
      },
      {
        Header: "Date",
        accessor: (row) => row?.updatedAt.split("T")[0],
      },
      {
        Header: "Time",
        accessor: (row) => row?.updatedAt.split("T")[1].split(".")[0],
      },
    ],
    []
  );

  const data = useMemo(() => notifications, [notifications]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/notification/getallnotifs`);
      dispatch(setLoading(false));
      setNotifications(temp);
    } catch (error) {}
  };

  useEffect(() => {
    getAllNotif();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Your Notifications
          </h2>

          {notifications.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default Notifications;
