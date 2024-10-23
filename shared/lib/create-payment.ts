// import { PaymentData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import axios from "axios";
import { axiosInstance } from "@/shared/services/instance";
import { CartDTO } from "@/shared/services/dto/cart.dto";

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props) {
  const { data } = await axiosInstance.post("http://localhost:3000/api/callback", {
    description: details.description,
    metadata: {
      order_id: details.orderId,
    },
    confirmation: {
      return_url: process.env.YOOKASSA_CALLBACK_URL,
    },
  });

  return data;
}

// export async function createPayment(details: Props) {
//
//   const paymentData = {
//     id: `PAYMENT_${details.orderId}`,
//     confirmation: {
//       confirmation_url: process.env.YOOKASSA_CALLBACK_URL || "http://localhost:3000/?paid",
//     },
//   };
//
//   return paymentData;
// }
