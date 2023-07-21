import React, { Fragment, useEffect, useMemo } from "react";
import jwt_decode from "jwt-decode";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchAppointments,
  completeAppointment,
  acceptAppointment,
} from "../redux/reducers/appointment.slice";
import Loading from "../components/Loading";
import Empty from "../components/Empty";

const Appointments = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const appointments = useSelector((state) => {
    return state.appointment.appointments;
  });

  const status = useSelector((state) => {
    return state.appointment.status;
  });

  const { userId } = jwt_decode(localStorage.getItem("token"));

  const navigateToChat = (appointment) => {
    navigate(`/appointment/chat/${appointment._id}`);
  };

  const complete = (ele) => {
    dispatch(completeAppointment(ele));
  };

  const accept = (ele) => {
    dispatch(acceptAppointment(ele));
  };

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const data = useMemo(() => appointments, [appointments]);
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
      },
      {
        Header: "Doctor",
        accessor: (row) =>
          `${row?.doctorId?.firstname} ${row?.doctorId?.lastname}`,
      },
      {
        Header: "Patient",
        accessor: (row) => `${row?.userId?.firstname} ${row?.userId?.lastname}`,
      },
      {
        Header: "Appointment Date",
        accessor: "date",
      },
      {
        Header: "Appointment Time",
        accessor: "time",
      },
      {
        Header: "Booking Date",
        accessor: (row) => row?.createdAt.split("T")[0],
      },
      {
        Header: "Booking Time",
        accessor: (row) => row?.updatedAt.split("T")[1].split(".")[0],
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => {
          const isDisabled =
            row.original?.status === "Completed" ||
            row.original?.status === "Accepted";
          if (userId === row.original?.doctorId?._id) {
            return (
              <Fragment>
                <button
                  className={`btn bg-green-500 text-white px-4 py-2 m-2 rounded ${
                    row.original?.status === "Completed"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={row.original?.status === "Completed"}
                  onClick={() => complete(row.original)}
                >
                  Complete
                </button>

                <button
                  className={`btn bg-green-500 text-white px-4 py-2 m-2 rounded ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isDisabled}
                  onClick={() => accept(row.original)}
                >
                  Accept {row.original?.status}
                </button>
              </Fragment>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Chat",
        id: "chat",
        Cell: ({ row }) => {
          if (["Accepted", "Completed"].includes(row.original?.status)) {
            return (
              <button
                className="btn bg-blue-500 text-white px-4 py-2 m-2 rounded"
                onClick={() => navigateToChat(row.original)}
              >
                Go to Chat
              </button>
            );
          } else {
            return null;
          }
        },
      },
    ],
    [userId]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Your Appointments
          </h2>
          {appointments.length > 0 ? (
            <div className="mt-6 overflow-auto">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="bg-gray-50"
                    >
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
                      <tr
                        {...row.getRowProps()}
                        className="hover:bg-gray-100 transition ease-in-out duration-200"
                      >
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

export default Appointments;
