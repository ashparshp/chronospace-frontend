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

const CheckList = ({ items }) => {
  return (
    <div className="my-4 pl-2">
      {items.map((item, i) => (
        <CheckboxItem key={i} checked={item.checked} text={item.text} />
      ))}
    </div>
  );
};

const Table = ({ content, withHeadings }) => {
  if (typeof content === "string") {
    const tableLines = content.split("\n");
    content = tableLines.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0)
    );
  }

  if (!Array.isArray(content) || content.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
        <p className="text-gray-500 dark:text-gray-400">
          Table content missing or invalid
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        {withHeadings && (
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              {content[0].map((cell, cellIndex) => (
                <th
                  key={cellIndex}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {content.slice(withHeadings ? 1 : 0).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-white dark:bg-black"
                  : "bg-gray-50 dark:bg-gray-900"
              }
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const List = ({ style, items }) => {
  if (
    items &&
    items.length > 0 &&
    typeof items[0] === "object" &&
    "checked" in items[0]
  ) {
    return <CheckList items={items} />;
  }

  const renderListItem = (item) => {
    if (typeof item === "string") {
      return <span dangerouslySetInnerHTML={{ __html: item }}></span>;
    }

    if (typeof item === "object" && item !== null) {
      if ("checked" in item) {
        return <CheckboxItem checked={item.checked} text={item.text || ""} />;
      }

      if (item.content) {
        return <span dangerouslySetInnerHTML={{ __html: item.content }}></span>;
      }

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

      if (item.text) {
        return <span dangerouslySetInnerHTML={{ __html: item.text }}></span>;
      }

      try {
        return String(item);
      } catch (err) {
        return "[Complex Object]";
      }
    }

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

const Code = ({ code, language = "" }) => {
  if (
    code &&
    typeof code === "object" &&
    code.toString() === "[object HTMLPreElement]"
  ) {
    try {
      let codeText = "";
      if (code.textContent) codeText = code.textContent;
      else if (code.innerText) codeText = code.innerText;
      else if (code.innerHTML) codeText = code.innerHTML;
      else codeText = "Unable to extract code from HTMLPreElement";

      return (
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg my-4 overflow-x-auto text-sm">
          <code className={language ? `language-${language}` : ""}>
            {codeText}
          </code>
        </pre>
      );
    } catch (error) {
      console.error("Error extracting code from HTMLPreElement:", error);
      return (
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg my-4 overflow-x-auto text-sm">
          <code>Error extracting code content</code>
        </pre>
      );
    }
  }

  return (
    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg my-4 overflow-x-auto text-sm">
      <code className={language ? `language-${language}` : ""}>{code}</code>
    </pre>
  );
};

const BlogContent = ({ block }) => {
  if (!block) return null;

  const type = block.type || "";
  const data = block.data || {};

  if (type === "table") {
    if (data && typeof data === "object") {
      if (!data.content && data.text) {
        return (
          <Table
            content={data.text.split("\n").map((line) =>
              line
                .split("|")
                .map((cell) => cell.trim())
                .filter((cell) => cell.length > 0)
            )}
            withHeadings={data.withHeadings || true}
          />
        );
      }

      if (Array.isArray(data.content)) {
        return (
          <Table
            content={data.content}
            withHeadings={data.withHeadings || true}
          />
        );
      }
    }
  }

  switch (type) {
    case "paragraph":
      return (
        <p dangerouslySetInnerHTML={{ __html: data.text }} className="my-4"></p>
      );

    case "header":
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
      return (
        <p
          className="text-xl font-semibold my-4"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></p>
      );

    case "image":
      return <Img url={data.file?.url} caption={data.caption} />;

    case "quote":
      return <Quote quote={data.text} caption={data.caption} />;

    case "list":
      return <List style={data.style} items={data.items} />;

    case "checklist":
    case "todo":
      return <CheckList items={data.items} />;

    case "code":
      return <Code code={data.code} language={data.language} />;

    case "table":
      return <Table content={data.content} withHeadings={data.withHeadings} />;

    default:
      console.log("Unknown block type:", type, data);
      return null;
  }
};

export default BlogContent;
