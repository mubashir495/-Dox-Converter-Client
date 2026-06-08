"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function OcrDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://documents-tan.vercel.app/ocr/upload";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://documents-tan.vercel.app";

  const uploadFile = async (
    mode: "read" | "convert-word" | "convert-excel" | "convert-txt"
  ) => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    setText("");
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}?mode=${mode}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // ❌ API error handling
      if (!response.ok) {
        toast.error(data?.error || "Something went wrong");
        return;
      }

      // ✅ READ MODE
      if (mode === "read") {
        setText(data.text || "No text found");
      }

      // ✅ CONVERT MODES
      if (
        mode === "convert-word" ||
        mode === "convert-excel" ||
        mode === "convert-txt"
      ) {
        setText("File converted successfully 🎉");
        setDownloadUrl(data.download || null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6 md:p-12 flex items-start justify-center">
      <div className="w-full max-w-4xl space-y-8">

        <header className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-sky-800">OCR Document Converter</h1>
          <p className="text-sm text-sky-600 mt-1">Upload a document and read or convert it to Word/Excel/Text using the documents API.</p>
        </header>

        {/* HEADER */}
        <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-sky-700">Upload & Convert</CardTitle>
            </CardHeader>

          <CardContent className="space-y-4">
            {/* FILE INPUT */}
            <Input
              type="file"
              accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* TABS */}
            <Tabs defaultValue="read" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="read">Read</TabsTrigger>
                <TabsTrigger value="word">Word</TabsTrigger>
                <TabsTrigger value="excel">Excel</TabsTrigger>
                <TabsTrigger value="txt">Text</TabsTrigger>
              </TabsList>

              {/* READ */}
              <TabsContent value="read" className="pt-4">
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  disabled={!file || loading}
                  onClick={() => uploadFile("read")}
                >
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Extract Text
                </Button>
              </TabsContent>

              {/* WORD */}
              <TabsContent value="word" className="pt-4">
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  disabled={!file || loading}
                  onClick={() => uploadFile("convert-word")}
                >
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Convert to Word
                </Button>
              </TabsContent>

              {/* EXCEL */}
              <TabsContent value="excel" className="pt-4">
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  disabled={!file || loading}
                  onClick={() => uploadFile("convert-excel")}
                >
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Convert to Excel
                </Button>
              </TabsContent>

              {/* TXT */}
              <TabsContent value="txt" className="pt-4">
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  disabled={!file || loading}
                  onClick={() => uploadFile("convert-txt")}
                >
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Convert to Text
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* RESULT TEXT */}
        {text && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-sky-50 p-4 rounded">
                {text}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* DOWNLOAD */}
        {downloadUrl && (
          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-green-600 font-medium">
                File ready for download 🎉
              </p>

              <a href={`${API_BASE}/uploads/${downloadUrl}`} target="_blank" rel="noreferrer">
                <Button>Download File</Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
