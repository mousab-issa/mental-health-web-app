import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const parseLineBreak = (str) => str?.replace(/\\n/g, "\\\n") ?? "";

const MarkDown = ({ children: text = "", ...rest }) => {
  return (
    <div {...rest}>
      <ReactMarkdown
        rehypePlugins={[remarkGfm, rehypeRaw]}
        className="space-y-4"
        components={{
          u: ({ children, ...props }) => (
            <span className="underline" {...props}>
              {children}
            </span>
          ),
          h1: ({ children, ...props }) => (
            <h1
              className="text-h1 tracking-tight text-midnight sm:leading-none xl:text-6xl"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-h2 font-normal xl:text-5xl" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-h3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-h4" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-h5" {...props}>
              {children}
            </h5>
          ),
          p: ({ children, ...props }) => (
            <p className="text-body1 text-grey-500" {...props}>
              {children}
            </p>
          ),
          caption: ({ children, ...props }) => (
            <span
              className="text-label-small font-medium text-grey-500"
              {...props}
            >
              {children}
            </span>
          ),
          label: ({ children, ...props }) => (
            <span
              className="text-label-medium font-medium text-grey-500"
              {...props}
            >
              {children}
            </span>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 text-body1 font-semibold leading-8 text-midnight">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="list-disc pl-4 text-body1	font-semibold leading-8 text-midnight">
              {children}
            </li>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 text-body1	font-semibold leading-8 text-midnight">
              {children}
            </ol>
          ),
        }}
      >
        {parseLineBreak(text)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDown;
