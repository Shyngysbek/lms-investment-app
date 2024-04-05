"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CourseEnrollForFreeButtonProps {
  courseId: string;
}

export const CourseEnrollForFreeButton = ({
  courseId,
}: CourseEnrollForFreeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  
  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout/free`)
      
      router.refresh();
      toast.success("Enrolled successfully")
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mb-7 md:mb-0">
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto"
      >
        Enroll for free
      </Button>
      <span className="absolute block text-xs text-slate-500">*for testing purposes</span>
    </div>
  )
}