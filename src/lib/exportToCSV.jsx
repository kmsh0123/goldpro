import { CSVLink } from "react-csv";

/**
 * Generate reusable CSV export configuration
 * @param {Array} data - Your table data array
 * @param {Array} columns - Column definitions [{label, key}]
 * @param {string} filename - Export file name
 * @returns {Object} CSVLink props
 */
export const getCSVExportConfig = (data, columns, filename = "data.csv") => {
  return {
    headers: columns,
    data,
    filename,
  };
};

/**
 * Reusable CSVLink Wrapper (to avoid repeating props)
 */
export const CSVExportLink = ({ config, children, className }) => (
  <CSVLink
    {...config}
    className={`flex items-center gap-2 ${className}`}
    target="_blank"
  >
    {children}
  </CSVLink>
);
