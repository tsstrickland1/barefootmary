"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function FlashToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""));
    } else if (error) {
      toast.error(error);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""));
    }
  }, [searchParams, router, pathname]);

  return null;
}
