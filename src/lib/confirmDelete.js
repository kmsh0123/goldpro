// utils/confirmDelete.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Show a confirmation dialog. Returns true if user confirmed.
 */
export async function confirmDelete(name) {
  const result = await MySwal.fire({
    title: "Are you sure?",
    text: `Delete ${name}? This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    // Show a second alert to indicate success
    await MySwal.fire({
      title: "Deleted!",
      text: `${name} has been deleted.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    return true; // let the caller know it was confirmed
  }

  return false; // user canceled
}
