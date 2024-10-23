import { PaymentData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import axios from "axios";
import {axiosInstance} from "@/shared/services/instance"
import {CartDTO} from "@/shared/services/dto/cart.dto"

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props) {
  // const { data } = await axios.post<PaymentData>("http://localhost:3000/payments", {
    // description: details.description,
    // metadata: {
    //   order_id: details.orderId,
    // },
    // confirmation: {
    //   type: "redirect",
    //   return_url: process.env.YOOKASSA_CALLBACK_URL,
    // },
  // })
  // todo Тут ти будеш стукатись в ендпоінт пейментс, передавай сюда то шо нада шоб провірити патіж, ну і дивись шо поверне цей запрос, наприклад якщо буде тру то редіректи і тд
  const data = await axiosInstance.post("http://localhost:3000/api/payments")
  console.log('dataqweasad', data)
  // const { data } = await axios.post<PaymentData>("http://localhost:3000/api/callback", {
  //   description: details.description,
  //   metadata: {
  //     order_id: details.orderId,
  //   },
  //   confirmation: {
  //     type: "redirect",
  //     return_url: process.env.YOOKASSA_CALLBACK_URL,
  //   },
  // });

  return {data: 'asd'};
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
