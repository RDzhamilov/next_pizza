import { toast } from "react-hot-toast";
import { SUCCESS_ICON, ERROR_ICON } from "@/shared/constants";

type ToastOptions = {
  message: string;
  withIcon?: boolean;
  duration?: number;
};

// const DEFAULT_DURATION = 3000;

export const SuccessCustomToast = ({
  message,
  withIcon = false,
  duration = 2000,
}: ToastOptions) => {
  toast.success(message, {
    icon: withIcon ? SUCCESS_ICON : undefined,
    duration: duration,
  });
};

export const ErrorCustomToast = ({ message, withIcon = false, duration = 4000 }: ToastOptions) => {
  toast.error(message, {
    icon: withIcon ? ERROR_ICON : undefined,
    duration: duration,
  });
};
