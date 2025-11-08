import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);
  return isMobile;
};

export const ReusableTable = ({
  columns,
  data,
  onRowClick,
  scale = 0.5,
  keyExtractor = (item, index) => item?.id || index,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scaledHeight, setScaledHeight] = useState(undefined);

  const handleRowClick = (item) => {
    if (onRowClick) onRowClick(item, navigate);
  };

  const renderCellContent = (item, column) => {
    if (column.render) return column.render(item);
    if (column.key) return item[column.key];
    if (column.text) return column.text;
    return null;
  };

  useLayoutEffect(() => {
    if (!isMobile) {
      setScaledHeight(undefined);
      return;
    }
    const measure = () => {
      if (!contentRef.current) return;
      const rawHeight = contentRef.current.offsetHeight || 0;
      setScaledHeight(rawHeight * scale);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile, data, columns]);

  return (
    <div className="px-6 pb-4 mb-3">
      {/* IMPORTANT: prevent horizontal scroll on mobile */}
      <div className="overflow-x-hidden">
        {/* Wrapper that reserves only the scaled height on mobile */}
        <div
          ref={containerRef}
          className="relative md:static"
          style={
            isMobile && scaledHeight != null
              ? { height: scaledHeight, width: "100%" }
              : undefined
          }
        >
          <div
            ref={contentRef}
            className={
              isMobile ? "absolute left-0 top-0 origin-top-left" : "static"
            }
            style={
              isMobile
                ? {
                    transform: `scale(${scale})`,
                    // Make visual width equal to container width after scaling
                    width: `${(100 / scale).toFixed(4)}%`,
                    willChange: "transform",
                  }
                : undefined
            }
          >
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase ${
                        column.headerClassName || ""
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data?.map((item, index) => (
                  <tr
                    key={keyExtractor(item, index)}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    {columns.map((column, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-4 py-4 text-sm ${
                          column.cellClassName || "text-gray-200"
                        }`}
                      >
                        <pre>{renderCellContent(item, column)}</pre>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
