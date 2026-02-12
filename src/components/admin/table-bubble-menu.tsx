import type { Editor } from "@tiptap/react";
import {
  Columns3,
  Minus,
  Plus,
  Rows3,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TableBubbleMenuProps {
  editor: Editor;
}

export default function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  if (!editor.isActive("table")) return null;

  return (
    <div className="flex items-center gap-0.5 border-b bg-muted/50 p-1">
      <span className="px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Tabulka
      </span>
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <Plus className="size-3" />
        <Columns3 className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns3 className="size-3" />
        <Plus className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Columns3 className="size-3" />
        <Minus className="size-3" />
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <Plus className="size-3" />
        <Rows3 className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows3 className="size-3" />
        <Plus className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Rows3 className="size-3" />
        <Minus className="size-3" />
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        Hlavicka
      </Button>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="size-3 mr-1" />
        Smazat
      </Button>
    </div>
  );
}
