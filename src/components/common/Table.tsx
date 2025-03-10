import React, { JSX } from 'react';

interface Column {
  Header: string;
  accessor: string;
  Cell?: (props: any) => JSX.Element;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: (item: any) => JSX.Element;
  onRowClick?: (item: any) => void;
}

export default function Table({ data, columns, actions, onRowClick }: TableProps) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.Header}
                    </th>
                  ))}
                  {actions && (
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((item, rowIdx) => (
                    <tr 
                      key={rowIdx}
                      className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                      onClick={onRowClick ? () => onRowClick(item) : undefined}
                    >
                      {columns.map((column, colIdx) => (
                        <td
                          key={colIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          {column.Cell ? (
                            column.Cell({ value: item[column.accessor], row: { original: item } })
                          ) : (
                            item[column.accessor]
                          )}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {actions(item)}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={columns.length + (actions ? 1 : 0)} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}