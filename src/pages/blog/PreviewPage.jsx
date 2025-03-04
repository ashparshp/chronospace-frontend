// src/pages/blog/PreviewPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import EditorJS from "@editorjs/editorjs";
import { useAuth } from "../../context/AuthContext";
import { Tag, ArrowLeft, Eye, Calendar } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const PreviewPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const editorRef = useRef(null);
  const [previewData, setPreviewData] = useState(null);

  // Load preview data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("blog-preview");

    if (data) {
      try {
        setPreviewData(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing preview data:", error);
      }
    }
  }, []);

  // Initialize editor
  useEffect(() => {
    if (previewData && previewData.content && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs-preview",
        tools: {},
        data: previewData.content,
        readOnly: true,
        minHeight: 0,
      });
    }

    // Cleanup editor
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [previewData]);

  // Format date
  const formatDate = () => {
    return format(new Date(), "MMMM d, yyyy");
  };

  // If no preview data
  if (!previewData) {
    return (
      <EmptyState
        title="No Preview Available"
        description="There is no blog preview data available. Please go back to the editor."
        actionText="Go to Editor"
        actionLink="/editor"
        icon={<Eye className="h-12 w-12 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Preview Header */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-300 font-medium">
              Preview Mode
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Editor
            </Button>
          </div>
        </div>

        {/* Blog Header */}
        <div>
          {/* Category & Visibility */}
          <div className="flex items-center space-x-2 mb-3">
            {previewData.category && (
              <Badge
                variant="secondary"
                className="uppercase text-xs tracking-wide"
              >
                {previewData.category}
              </Badge>
            )}

            <Badge variant="info" className="text-xs">
              {previewData.visibility === "private"
                ? "Private"
                : previewData.visibility === "followers_only"
                ? "Followers Only"
                : "Public"}
            </Badge>

            {previewData.is_premium && (
              <Badge
                variant="accent"
                className="bg-accent-500 text-white uppercase text-xs tracking-wide"
              >
                Premium
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {previewData.title || "Untitled Blog"}
          </h1>

          {/* Description */}
          {previewData.des && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-3">
              {previewData.des}
            </p>
          )}

          {/* Author and date */}
          <div className="flex items-center mt-6 space-x-3">
            <Avatar
              src={currentUser.profile_img}
              alt={currentUser.fullname}
              size="md"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {currentUser.fullname}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner image */}
        {previewData.banner && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={previewData.banner}
              alt={previewData.title || "Blog banner"}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Blog content */}
        <div className="prose dark:prose-invert max-w-none">
          <div id="editorjs-preview"></div>
        </div>

        {/* Tags */}
        {previewData.tags && previewData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            {previewData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PreviewPage;
