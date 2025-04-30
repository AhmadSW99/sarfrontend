"use client";

i"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// ✅ WebSocket setup with log
console.log("🔌 Connecting to WebSocket...");
const socket = io("https://sar-ks0x.onrender.com", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to backend WebSocket");
});

socket.on("connect_error", (err) => {
  console.error("❌ WebSocket connection failed:", err);
});

export default function DetectPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    console.log("📡 Listening for processed_image and error...");
  
    socket.on("processed_image", (data) => {
      console.log("✅ Received processed image from backend");
      setIsLoading(false);
      setProcessedImageUrl(data.image);
    });
  
    socket.on("error", (err) => {
      console.error("❌ Error from backend:", err.message || err);
      setIsLoading(false);
      setError(err.message || "Error from server");
    });
  
    return () => {
      socket.off("processed_image");
      socket.off("error");
    };
  }, []);
  

  const processFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PNG, JPG, GIF, or WEBP.');
      clearSelection();
      return;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      setError('File size exceeds 15MB.');
      clearSelection();
      return;
    }

    setSelectedFile(file);
    setError(null);
    setProcessedImageUrl(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      sendImage(reader.result); // Immediately send when ready
    };
    reader.readAsDataURL(file);
  };

  const sendImage = (base64Image) => {
    console.log("📤 Sending image to backend...");
    setIsLoading(true);
    socket.emit("upload_image", { image: base64Image });
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl && typeof previewUrl === 'string' && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- JSX ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Image</h2>
        </div>
        <p className="text-gray-500 mb-6 text-sm">Send an image for processing</p>

        {/* Upload Area */}
        <div
          className={`flex justify-center items-center w-full px-6 pt-5 pb-6 border-2 ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-md cursor-pointer transition-colors duration-200 ease-in-out`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l4.172-4.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <span className="relative font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Click to upload
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">Max. File Size: 15MB</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {/* Original Image Preview */}
        {previewUrl && !processedImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Image Preview:</p>
            <img src={previewUrl} alt="Selected preview" className="max-h-40 w-auto rounded-md border border-gray-300" />
          </div>
        )}

        {/* Processed Image */}
        {processedImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Processed Image:</p>
            <img src={processedImageUrl} alt="Processed result" className="max-h-60 w-auto rounded-md border border-gray-300" />
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-2 text-sm text-gray-600">Processing...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={clearSelection}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
