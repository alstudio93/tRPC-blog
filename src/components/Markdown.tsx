import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown: React.FC<{ children: string, className: string | string[] | null }> = ({ children, className }) => {
  
  return (
    <article className="prose sm:prose-base prose-sm prose-gray max-w-none">
      <div className={`${className ? className : "max-w-[800px] mx-auto"}`}>
        <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
      </div>
    </article>
  );
};

export default Markdown;
