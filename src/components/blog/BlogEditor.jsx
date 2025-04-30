import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import { createImageUploadHandler } from "../../services/uploadService";
import { EDITOR_JS_TOOLS } from "../../config/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { X, Image, Save, Upload, Check, Eye, ArrowLeft } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_VISIBILITY } from "../../config/constants";
import { blogService } from "../../services/blogService";
import { uploadService } from "../../services/uploadService";
import { useNotification } from "../../context/NotificationContext";
import { setupMarkdownPasteHandler } from "../../utils/simpleMarkdownPaste";

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("general");
  const [visibility, setVisibility] = useState("public");
  const [isPremium, setIsPremium] = useState(false);
  const [banner, setBanner] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      try {
        setFetchingBlog(true);
        setIsEdit(true);

        const response = await blogService.getBlog(blogId, true, "edit");
        const blogData = response.data.blog;

        setInitialData(blogData);
        setTitle(blogData.title || "");
        setDescription(blogData.des || "");
        setTags(blogData.tags || []);
        setCategory(blogData.category || "general");
        setVisibility(blogData.visibility || "public");
        setIsPremium(blogData.is_premium || false);
        setBanner(blogData.banner || "");
      } catch (error) {
        console.error("Error fetching blog:", error);
        showToast("Failed to load blog data", "error");
        navigate("/dashboard");
      } finally {
        setFetchingBlog(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, navigate, showToast]);

  useEffect(() => {
    if (editorRef.current) return;

    const editorElement = document.getElementById("editor");
    if (!editorElement) return;

    try {
      const editor = new EditorJS({
        holder: "editor",
        tools: {
          header: EDITOR_JS_TOOLS.header,
          list: EDITOR_JS_TOOLS.list,
          code: EDITOR_JS_TOOLS.code,
          embed: EDITOR_JS_TOOLS.embed,
          quote: EDITOR_JS_TOOLS.quote,
          marker: EDITOR_JS_TOOLS.marker,
          image: {
            class: EDITOR_JS_TOOLS.image.class,
            config: {
              uploader: createImageUploadHandler(),
            },
          },
          table: EDITOR_JS_TOOLS.table,
          checklist: EDITOR_JS_TOOLS.checklist,
        },
        placeholder: "Let's write an awesome story!",
        data: initialData?.content || {},
        async onChange() {
          if (editorReady) {
            try {
              const data = await editor.save();
              localStorage.setItem("editor-draft", JSON.stringify(data));
            } catch (error) {
              console.error("Error saving draft:", error);
            }
          }
        },
        onReady: () => {
          editorRef.current = editor;
          setEditorReady(true);

          setupMarkdownPasteHandler(editor);

          showToast(
            "Tip: You can paste markdown text into the editor and it will be automatically formatted!",
            "info",
            8000
          );
        },
      });
    } catch (error) {
      console.error("Error initializing EditorJS:", error);
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        editorRef.current = null;
      }
    };
  }, [initialData, editorReady, showToast]);

  useEffect(() => {
    if (editorRef.current && initialData?.content && isEdit && editorReady) {
      editorRef.current.render(initialData.content);
    } else if (!isEdit && editorReady) {
      const savedDraft = localStorage.getItem("editor-draft");
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          if (editorRef.current) {
            editorRef.current.render(draftData);
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  }, [initialData, isEdit, editorReady]);

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBanner("");
    setBannerFile(null);
  };

  const saveAsDraft = async () => {
    if (!title.trim()) {
      showToast("Please add a title for your draft", "error");
      return;
    }

    setSaving(true);
    try {
      const content = await editorRef.current.save();
      let bannerUrl = banner;

      if (bannerFile) {
        const uploadResult = await uploadService.uploadToS3(
          bannerFile,
          bannerFile.type
        );
        bannerUrl = uploadResult.fileUrl;
      }

      const blogData = {
        title,
        des: description,
        banner: bannerUrl,
        tags,
        content,
        draft: true,
        category,
        visibility,
        is_premium: isPremium,
        id: blogId,
      };

      const response = await blogService.createUpdateBlog(blogData);

      localStorage.removeItem("editor-draft");

      showToast("Draft saved successfully", "success");
      navigate(`/dashboard?tab=drafts`);
    } catch (error) {
      console.error("Error saving draft:", error);
      showToast(error.response?.data?.error || "Failed to save draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const publishBlog = async () => {
    if (!title.trim()) {
      showToast("Please add a title", "error");
      return;
    }

    if (!description.trim() || description.length > 200) {
      showToast("Please add a description (max 200 characters)", "error");
      return;
    }

    if (tags.length === 0) {
      showToast("Please add at least one tag", "error");
      return;
    }

    let content;
    try {
      content = await editorRef.current.save();
      if (!content.blocks || content.blocks.length === 0) {
        showToast("Please add some content to your blog", "error");
        return;
      }
    } catch (error) {
      console.error("Error saving editor content:", error);
      showToast("Failed to save editor content", "error");
      return;
    }

    setLoading(true);
    try {
      let bannerUrl = banner;

      if (bannerFile) {
        const uploadResult = await uploadService.uploadToS3(
          bannerFile,
          bannerFile.type
        );
        bannerUrl = uploadResult.fileUrl;
      }

      const blogData = {
        title,
        des: description,
        banner: bannerUrl,
        tags,
        content,
        draft: false,
        category,
        visibility,
        is_premium: isPremium,
        id: blogId,
      };

      const response = await blogService.createUpdateBlog(blogData);

      localStorage.removeItem("editor-draft");

      showToast(
        isEdit ? "Blog updated successfully" : "Blog published successfully",
        "success"
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing blog:", error);
      showToast(
        error.response?.data?.error || "Failed to publish blog",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const previewBlog = async () => {
    try {
      const content = await editorRef.current.save();
      sessionStorage.setItem(
        "blog-preview",
        JSON.stringify({
          title,
          des: description,
          banner,
          tags,
          content,
          category,
          visibility,
          is_premium: isPremium,
        })
      );
      window.open("/preview", "_blank");
    } catch (error) {
      console.error("Error creating preview:", error);
      showToast("Failed to create preview", "error");
    }
  };

  if (fetchingBlog) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black shadow-md rounded-lg overflow-hidden">
      {/* Editor Header/Toolbar */}
      <div className="bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isEdit ? "Edit Blog" : "Create Blog"}
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={previewBlog}
              disabled={loading || saving}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveAsDraft}
              disabled={loading || saving}
              isLoading={saving}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={publishBlog}
              disabled={loading || saving}
              isLoading={loading}
            >
              <Check className="h-4 w-4 mr-1" />
              {isEdit ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="p-6">
        {/* Title Input */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="text-2xl font-bold mb-4 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus:ring-0"
        />

        {/* Banner Upload */}
        <div className="mb-6">
          {banner ? (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={banner}
                alt="Banner"
                className="w-full h-64 object-cover"
              />
              <Button
                variant="danger"
                size="sm"
                className="absolute top-2 right-2 rounded-full"
                onClick={removeBanner}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Image className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Drag & drop a banner image or click to upload
                </p>
                <div>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("banner-upload").click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Banner
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short description (max 200 characters)"
            maxLength={200}
            className="text-gray-800 dark:text-gray-200"
          />
          <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/200
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (up to 10)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-black rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="text-gray-800 dark:text-gray-200">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={addTag}
              placeholder="Add tags (press Enter or comma to add)"
              disabled={tags.length >= 10}
              className="flex-grow"
            />
            <Button
              variant="outline"
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 10}
              className="ml-2"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tags.length}/10 tags
          </p>
        </div>

        {/* Blog Properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={BLOG_CATEGORIES.map((cat) => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
            }))}
          />

          <Select
            label="Visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            options={[
              {
                value: BLOG_VISIBILITY.PUBLIC,
                label: "Public - Visible to everyone",
              },
              {
                value: BLOG_VISIBILITY.PRIVATE,
                label: "Private - Only visible to you",
              },
              {
                value: BLOG_VISIBILITY.FOLLOWERS_ONLY,
                label: "Followers Only",
              },
            ]}
          />

          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="premium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
            />
            <label
              htmlFor="premium"
              className="ml-2 text-gray-700 dark:text-gray-300"
            >
              Premium Content
            </label>
          </div>
        </div>

        {/* Editor.js Container */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[400px]">
          <div className="markdown-support-tip text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
            Tip: You can paste markdown content and it will be automatically
            formatted.
          </div>
          <div id="editor" className="prose dark:prose-invert max-w-none"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
