import { useState, useMemo } from "react";

/**
 * @param {Array} data - original data array
 * @param {Array|string} keys - object keys to search by, e.g. ["name","email"]
 */
export default function useSearchFilter(data, keys = []) {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!query) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(item =>
      keys.some(key => String(item[key]).toLowerCase().includes(lowerQuery))
    );
  }, [data, query, keys]);

  return { query, setQuery, filteredData };
}
