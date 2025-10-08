import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function usePaginatedList({ queryHook, limit = 10 }) {
const [searchParams] = useSearchParams()
  const navigate = useNavigate();
//   const [page, setPage] = React.useState(1);
  const page = Number(searchParams.get("page")) || 1;
  const skip = (page - 1) * limit;

  const { data, isLoading, isError, error } = queryHook();
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
    //   setPage(totalPages);
      navigate(`?page=${totalPages}`);

    }
  }, [page, totalPages]);

  const currentPageData = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.length > limit
      ? data.data.slice(skip, skip + limit)
      : data.data;
  }, [data, page]);

   const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`?page=${newPage}`);
    // setPage(newPage);
    }
  };

    return { page, limit, totalPages, isLoading, isError, error, currentPageData, handlePageChange, totalItems };

}
