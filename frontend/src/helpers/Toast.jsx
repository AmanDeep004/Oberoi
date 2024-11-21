import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = (message, type = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
};

export default Toast;
