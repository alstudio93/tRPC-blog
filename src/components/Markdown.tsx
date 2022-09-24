import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from 'remark-gemoji'

// const Markdown: React.FC<{ children: string, className: string | string[] | null }> = ({ children, className }) => {
const Markdown: React.FC<{ children: string }> = ({ children}) => {
  
  return (
    // <article className="prose sm:prose-base prose-sm prose-gray max-w-none">
    //   <div className={`${className ? className : "max-w-[800px] mx-auto"}`}>
    //     <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    //   </div>
    // </article>
    <article className="prose sm:prose-base prose-sm prose-gray max-w-none">
      <div className="max-w-[800px] mx-auto">
        <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm, remarkGemoji]}>{children}</ReactMarkdown>
      </div>
    </article>
  );
};

export default Markdown;
