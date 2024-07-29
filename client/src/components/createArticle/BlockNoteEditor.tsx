import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function BlockNoteEditor({
  isLoading,
  saveDraft,
  debounceSaveDraft,
}: {
  isLoading: boolean;
  saveDraft: (editor?: ReturnType<typeof useCreateBlockNote>) => Promise<any>;
  debounceSaveDraft: (
    fxn: (editor?: ReturnType<typeof useCreateBlockNote>) => Promise<any>,
    delay: number
  ) => void;
}) {
  // Creates a new editor instance.
  const editor: any = useCreateBlockNote();

  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("articleId");
  useEffect(() => {
    try {
      async function getArticle() {
        const article = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/content/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(article.data);
        const blog = article.data.getBlog;
        console.log(blog.content);

        if (blog.content) {
          const blocks = await editor.tryParseMarkdownToBlocks(blog.content);
          editor.replaceBlocks(editor.document, blocks);
        } else {
          const blocks = await editor.tryParseMarkdownToBlocks("");
          editor.replaceBlocks(editor.document, blocks);
        }
      }
      getArticle();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [articleId, editor]);

  return (
    <div className={`${isLoading ? "hidden" : "block"}`}>
      <BlockNoteView
        editor={editor}
        theme={"light"}
        onChange={async () => debounceSaveDraft(await saveDraft(editor), 1000)}
      />
    </div>
  );
}
