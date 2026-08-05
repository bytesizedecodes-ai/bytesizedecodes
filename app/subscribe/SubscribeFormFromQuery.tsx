"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";

/** Maps ?intent=pro (from /plans Notify me) to pre-selected interests. */
export function SubscribeFormFromQuery() {
  const params = useSearchParams();
  const intent = params.get("intent");
  const initialInterests =
    intent === "pro" ? ["paid_plans", "product_launches"] : [];

  return <InquiryForm kind="subscribe" initialInterests={initialInterests} />;
}
