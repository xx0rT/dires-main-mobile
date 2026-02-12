import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline as UnderlineIcon,
  Undo,
  Youtube,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor;
  onInsertLink: () => void;
  onInsertImage: () => void;
  onInsertYoutube: () => void;
}

const HIGHLIGHT_COLORS = [
  { label: "Zluta", value: "#fef08a" },
  { label: "Zelena", value: "#bbf7d0" },
  { label: "Modra", value: "#bfdbfe" },
  { label: "Ruzova", value: "#fbcfe8" },
  { label: "Oranzova", value: "#fed7aa" },
];

const TEXT_COLORS = [
  "#000000", "#374151", "#991b1b", "#9a3412", "#854d0e",
  "#166534", "#1e40af", "#6b21a8", "#be185d", "#dc2626",
  "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#9333ea",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  tooltip,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn("size-8 p-0", active && "bg-muted")}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function EditorToolbar({
  editor,
  onInsertLink,
  onInsertImage,
  onInsertYoutube,
}: EditorToolbarProps) {
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setInsertOpen(false);
  };

  const insertCallout = (type: "tip" | "warning" | "info") => {
    const icons = { tip: "💡", warning: "⚠️", info: "ℹ️" };
    const titles = { tip: "Tip", warning: "Upozorneni", info: "Informace" };
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="callout callout-${type}" data-type="${type}"><p><strong>${icons[type]} ${titles[type]}</strong></p><p>Vase obsah zde...</p></div>`
      )
      .run();
    setInsertOpen(false);
  };

  const insertFaq = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<details class="faq-item"><summary>Otazka zde...</summary><p>Odpoved zde...</p></details>`
      )
      .run();
    setInsertOpen(false);
  };

  const insertCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
    setInsertOpen(false);
  };

  const insertHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
    setInsertOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        tooltip="Tucne"
      >
        <Bold className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        tooltip="Kurziva"
      >
        <Italic className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        tooltip="Podtrzeni"
      >
        <UnderlineIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        tooltip="Preskrtnuti"
      >
        <Strikethrough className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        tooltip="Inline kod"
      >
        <Code className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
        tooltip="Dolni index"
      >
        <Subscript className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
        tooltip="Horni index"
      >
        <Superscript className="size-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover open={colorOpen} onOpenChange={setColorOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <Palette className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Barva textu</p>
          <div className="flex flex-wrap gap-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                className="size-6 rounded border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setColorOpen(false);
                }}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1.5 h-7 w-full text-xs"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setColorOpen(false);
            }}
          >
            Odebrat barvu
          </Button>
        </PopoverContent>
      </Popover>

      <Popover open={highlightOpen} onOpenChange={setHighlightOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("size-8 p-0", editor.isActive("highlight") && "bg-muted")}
          >
            <Highlighter className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Zvyrazneni</p>
          <div className="flex gap-1">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                className="size-6 rounded border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: c.value }}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: c.value }).run();
                  setHighlightOpen(false);
                }}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1.5 h-7 w-full text-xs"
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              setHighlightOpen(false);
            }}
          >
            Odebrat zvyrazneni
          </Button>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        tooltip="Nadpis 1"
      >
        <Heading1 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        tooltip="Nadpis 2"
      >
        <Heading2 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        tooltip="Nadpis 3"
      >
        <Heading3 className="size-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        tooltip="Zarovnat vlevo"
      >
        <AlignLeft className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        tooltip="Na stred"
      >
        <AlignCenter className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        tooltip="Zarovnat vpravo"
      >
        <AlignRight className="size-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        tooltip="Odrazky"
      >
        <List className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        tooltip="Cislovany seznam"
      >
        <ListOrdered className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive("taskList")}
        tooltip="Ukoly"
      >
        <ListTodo className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        tooltip="Citace"
      >
        <Quote className="size-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton onClick={onInsertLink} tooltip="Odkaz">
        <LinkIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={onInsertImage} tooltip="Obrazek">
        <ImageIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={onInsertYoutube} tooltip="YouTube video">
        <Youtube className="size-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover open={insertOpen} onOpenChange={setInsertOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
            Vlozit
            <ChevronDown className="size-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="start">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pokrocile prvky
          </p>
          <InsertMenuItem icon={<Table className="size-3.5" />} label="Tabulka" onClick={insertTable} />
          <InsertMenuItem icon={<Code2 className="size-3.5" />} label="Blok kodu" onClick={insertCodeBlock} />
          <InsertMenuItem icon={<Minus className="size-3.5" />} label="Oddelovac" onClick={insertHorizontalRule} />

          <Separator className="my-1" />
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Callout boxy
          </p>
          <InsertMenuItem icon={<span className="text-sm">💡</span>} label="Tip" onClick={() => insertCallout("tip")} />
          <InsertMenuItem icon={<span className="text-sm">⚠️</span>} label="Upozorneni" onClick={() => insertCallout("warning")} />
          <InsertMenuItem icon={<span className="text-sm">ℹ️</span>} label="Informace" onClick={() => insertCallout("info")} />

          <Separator className="my-1" />
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Interaktivni
          </p>
          <InsertMenuItem icon={<span className="text-sm">❓</span>} label="FAQ sekce" onClick={insertFaq} />
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        tooltip="Zpet"
      >
        <Undo className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        tooltip="Vpred"
      >
        <Redo className="size-3.5" />
      </ToolbarButton>
    </div>
  );
}

function InsertMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
    >
      {icon}
      {label}
    </button>
  );
}
