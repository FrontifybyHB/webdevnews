"use client";

import axios from "axios";
import { NewsItem } from "@/types/news";

export async function fetchWebDevNews(skip: number = 0): Promise<NewsItem[]> {
  try {
    const { data } = await axios.get<NewsItem[]>("/api/news", {
      params: { skip },
      timeout: 25_000,
      headers: { Accept: "application/json" },
    });
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message =
        (e.response?.data as { error?: string } | undefined)?.error ??
        e.message ??
        "Failed to fetch news";
      throw new Error(message);
    }
    throw e;
  }
}

