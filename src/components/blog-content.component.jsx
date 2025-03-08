// src/components/blog-content.component.jsx

const Img = ({ url, caption }) => {
  return (
    <div>
      <img
        src={url}
        alt={caption || "Blog image"}
        className="w-full rounded-lg"
      />
      {caption && caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-gray-600 dark:text-gray-400">
          {caption}
        </p>
      ) : null}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-primary-100/30 dark:bg-primary-900/20 p-3 pl-5 border-l-4 border-primary-500 rounded-r-lg my-4">
      <p className="text-xl leading-10 md:text-2xl font-serif italic">
        {" "}
        {quote}
      </p>
      {caption && caption.length ? (
        <p className="w-full text-primary-600 dark:text-primary-400 text-base mt-2">
          — {caption}
        </p>
      ) : null}
    </div>
  );
};

// Checkbox component for checklist items
const CheckboxItem = ({ checked, text }) => {
  return (
    <div className="flex items-start gap-2 my-1">
      <div className="mt-1 flex-shrink-0">
        {checked ? (
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 6h12v12H6z"
            />
          </svg>
        )}
      </div>
      <div
        className={`${
          checked ? "text-gray-500 dark:text-gray-400 line-through" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </div>
  );
};

// Checkbox list component
const CheckList = ({ items }) => {
  return (
    <div className="my-4 pl-2">
      {items.map((item, i) => (
        <CheckboxItem key={i} checked={item.checked} text={item.text} />
      ))}
    </div>
  );
};

const List = ({ style, items }) => {
  // Check if this is actually a checklist/todo list
  // (items with checked property)
  if (
    items.length > 0 &&
    typeof items[0] === "object" &&
    "checked" in items[0]
  ) {
    return <CheckList items={items} />;
  }

  // Function to render list item content based on its format
  const renderListItem = (item) => {
    if (typeof item === "string") {
      return <span dangerouslySetInnerHTML={{ __html: item }}></span>;
    }

    if (typeof item === "object" && item !== null) {
      // Check for EditorJS checklist item format
      if ("checked" in item) {
        return <CheckboxItem checked={item.checked} text={item.text || ""} />;
      }

      // Check for EditorJS list item format
      if (item.content) {
        return <span dangerouslySetInnerHTML={{ __html: item.content }}></span>;
      }

      // Check for EditorJS nested list item format
      if (item.items && Array.isArray(item.items)) {
        return (
          <>
            {item.content && (
              <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
            )}
            <ol
              className={
                style === "ordered" ? "list-decimal pl-5" : "list-disc pl-5"
              }
            >
              {item.items.map((nestedItem, j) => (
                <li key={j} className="my-1">
                  {renderListItem(nestedItem)}
                </li>
              ))}
            </ol>
          </>
        );
      }

      // If it has a text property
      if (item.text) {
        return <span dangerouslySetInnerHTML={{ __html: item.text }}></span>;
      }

      // For debugging - display what the object contains
      console.log("List item object:", item);

      // Last resort - stringify the object
      return JSON.stringify(item);
    }

    // Fallback for any other type
    return String(item);
  };

  return (
    <ol
      className={`pl-5 ${
        style === "ordered" ? "list-decimal" : "list-disc"
      } my-4`}
    >
      {items.map((listItem, i) => (
        <li key={i} className="my-2">
          {renderListItem(listItem)}
        </li>
      ))}
    </ol>
  );
};

const Code = ({ code }) => {
  return (
    <pre className="bg-gray-100 dark:bg-black p-4 rounded-lg my-4 overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
};

const BlogContent = ({ block }) => {
  if (!block) return null;

  let { type, data } = block;

  if (type === "paragraph") {
    return (
      <p dangerouslySetInnerHTML={{ __html: data.text }} className="my-4"></p>
    );
  }

  if (type === "header") {
    if (data.level === 1) {
      return (
        <h1
          className="text-5xl font-bold my-6"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h1>
      );
    }
    if (data.level === 2) {
      return (
        <h2
          className="text-4xl font-bold my-5"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h2>
      );
    }
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold my-4"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }
    if (data.level === 4) {
      return (
        <h4
          className="text-2xl font-bold my-3"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h4>
      );
    }
  }

  if (type === "image") {
    return <Img url={data.file?.url} caption={data.caption} />;
  }

  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }

  // Specific handler for checklist/todo type
  if (type === "checklist" || type === "todo") {
    return <CheckList items={data.items} />;
  }

  if (type === "code") {
    return <Code code={data.code} />;
  }

  // Return null for unhandled block types
  return null;
};

export default BlogContent;
