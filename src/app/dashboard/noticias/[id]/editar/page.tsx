"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NewsForm } from "@/components/dashboard/NewsForm";
import { api } from "@/services/apiService";

export default function EditarNoticiaPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setInitialData(response.data);
      } catch (err) {
        console.error("Error al cargar noticia para editar:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 animate-pulse space-y-8">
        <div className="h-10 w-48 bg-foreground/5 rounded-full" />
        <div className="h-[600px] w-full bg-foreground/5 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <NewsForm initialData={initialData} isEditing={true} />
    </div>
  );
}
