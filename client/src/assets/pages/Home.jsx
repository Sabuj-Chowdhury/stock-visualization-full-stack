import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const pagesPerGroup = 10;

  // Load your JSON data
  useEffect(() => {
    axios
      .get("/stock_market_data.json")
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "trade_code", header: "Trade Code" },
    { accessorKey: "high", header: "High" },
    { accessorKey: "low", header: "Low" },
    { accessorKey: "open", header: "Open" },
    { accessorKey: "close", header: "Close" },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: (info) =>
        parseInt(info.getValue().replace(/,/g, "")).toLocaleString(),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const totalPages = table.getPageCount();
  const startPage = currentGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, totalPages);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl text-center font-bold text-pink-500 mb-4">
        Stock Market Data
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 border border-gray-700">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center bg-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border border-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        {/* First Page */}
        <button
          className="px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => {
            setCurrentGroup(0);
            table.setPageIndex(0);
          }}
          disabled={table.getState().pagination.pageIndex === 0}
        >
          First
        </button>

        {/* Previous Group */}
        {currentGroup > 0 && (
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded"
            onClick={() => setCurrentGroup(currentGroup - 1)}
          >
            Prev
          </button>
        )}

        {/* Page Numbers */}
        {Array.from(
          { length: endPage - startPage },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              table.getState().pagination.pageIndex === page
                ? "bg-pink-500 text-white"
                : "bg-gray-700 text-white"
            }`}
            onClick={() => table.setPageIndex(page)}
          >
            {page + 1}
          </button>
        ))}

        {/* Next Group */}
        {endPage < totalPages && (
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded"
            onClick={() => setCurrentGroup(currentGroup + 1)}
          >
            Next
          </button>
        )}

        {/* Last Page */}
        <button
          className="px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => {
            setCurrentGroup(Math.floor(totalPages / pagesPerGroup));
            table.setPageIndex(totalPages - 1);
          }}
          disabled={table.getState().pagination.pageIndex === totalPages - 1}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
