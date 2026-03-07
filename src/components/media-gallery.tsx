"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Video, Expand, CirclePlay, X } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { Button } from "@/components/ui/button";

interface MediaGalleryProps {
  screenshots: string[];
  videos: string[];
}

export function MediaGallery({
  screenshots = [],
  videos = [],
}: MediaGalleryProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Card className="shadow-none h-full">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            Media Gallery
          </CardTitle>
          <CardDescription>
            All visual feedback submitted by testers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <Tabs defaultValue="screenshots">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="screenshots">
                <Camera className="mr-2 hidden sm:block" size={15} />{" "}
                <span className="text-xs sm:text-sm mr-1">Screenshots</span> (
                {screenshots.length})
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="mr-2 hidden sm:block" size={15} />{" "}
                <span className="text-xs sm:text-sm mr-1">Videos</span> (
                {videos.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="screenshots" className="mt-4">
              {screenshots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {screenshots.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                      onClick={() => setFullscreenImage(url)}
                    >
                      <SafeImage
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No screenshots submitted yet.
                </p>
              )}
            </TabsContent>
            <TabsContent value="videos" className="mt-4">
              {videos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {videos.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer bg-black/10"
                      onClick={() => setFullscreenVideo(url)}
                    >
                      <video src={url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                        <CirclePlay className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No videos submitted yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {mounted &&
        fullscreenImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setFullscreenImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="w-8 h-8" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
              <SafeImage
                src={fullscreenImage}
                alt="Fullscreen view"
                fill
                className="object-contain animate-in zoom-in-95"
              />
            </div>
          </div>,
          document.body,
        )}
      {mounted &&
        fullscreenVideo &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setFullscreenVideo(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
              onClick={() => setFullscreenVideo(null)}
            >
              <X className="w-8 h-8" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full max-w-4xl">
              <video
                controls
                autoPlay
                src={fullscreenVideo}
                className="w-full h-auto animate-in zoom-in-95 rounded-lg"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
