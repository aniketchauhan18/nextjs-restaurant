import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import OrderItem from "../../../../lib/models/orderItem.model";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // connect to database
    await connect();
    const { menuId, quantity, price, userId } = await req.json();
    console.log(menuId, quantity, price, userId);

    // check if same menu exists if so then add one to the quantity
    const sameMenuExists = await OrderItem.find({
      $and: [
        {
          menuId: menuId,
        },
        {
          userId: userId,
        },
      ],
    });

    // adding one to the quantity by default set to the quantity
    if (sameMenuExists.length > 0) {
      // increse the quantity by one
      const newQuantity = sameMenuExists[0].quantity + 1;
      const newPrice = newQuantity * price; // set the price accordingly
      const newOrderItem = await OrderItem.findByIdAndUpdate(
        sameMenuExists[0]._id,
        {
          quantity: newQuantity,
          price: newPrice,
        },
        {
          new: true,
        },
      );

      console.log(newOrderItem);
      return NextResponse.json(
        {
          message: "Order quantity incremented successfully",
          orderItem: newOrderItem,
        },
        {
          status: 201,
        },
      );
    }

    const newOrderItem = await OrderItem.create({
      userId,
      price,
      quantity,
      menuId,
      status: "pending",
    });
    console.log(newOrderItem);

    if (!newOrderItem) {
      return NextResponse.json(
        {
          message: "Error adding order to the order Item",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Order added successfully",
        orderItem: newOrderItem,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.log("Inside add-order api call");
    NextResponse.json(
      {
        message: "Error adding order item",
      },
      {
        status: 500,
      },
    );
  }
}
