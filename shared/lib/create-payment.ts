import { PaymentData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import axios from "axios";

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

// export async function createPayment(details: Props) {
//   const { data } = await axios.post<PaymentData>("http://localhost:3000/api/callback", {
//     description: details.description,
//     metadata: {
//       order_id: details.orderId,
//     },
//     confirmation: {
//       type: "redirect",
//       return_url: process.env.YOOKASSA_CALLBACK_URL,
//     },
//   });

//   return data;
// }

export async function createPayment(details: Props) {
  const paymentData = {
    id: `PAYMENT_${details.orderId}`,
    confirmation: {
      confirmation_url: process.env.YOOKASSA_CALLBACK_URL || "http://localhost:3000/?paid",
    },
  };

  return paymentData;
}
