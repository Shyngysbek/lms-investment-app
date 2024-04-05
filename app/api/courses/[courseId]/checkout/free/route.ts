import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { Courgette } from "next/font/google";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      }
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: params.courseId
        }
      }
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const freePurchase = await db.purchase.create({
      data: {
        courseId: params.courseId,
        userId: userId,
      }
    });

    return NextResponse.json(freePurchase);
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT_FREE]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}