"use client";
import { useRef, useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { Image as TiptapImage } from "@tiptap/extension-image";

// Register languages
lowlight.registerLanguage("javascript", javascript);
lowlight.registerLanguage("typescript", typescript);
lowlight.registerLanguage("html", html);
import YouTube from "@tiptap/extension-youtube";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  ImageIcon,
  LinkIcon,
  X,
  Undo,
  Redo,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  SuperscriptIcon,
  SubscriptIcon,
  TableIcon,
  Search,
  Type,
  FileCode,
  Youtube,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  FileUp,
  Smile,
  Pilcrow,
  Eraser,
  Scissors,
  Copy,
  Clipboard,
  Columns,
  SquarePen,
  Wand2,
  SpellCheckIcon as Spellcheck,
  Printer,
  Download,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";
const grammarHighlightKey = new PluginKey("grammarHighlight");

// Custom extension for font size
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    };
  },
});

// Special characters
const specialCharacters = [
  { char: "&", description: "Ampersand" },
  { char: "©", description: "Copyright" },
  { char: "®", description: "Registered Trademark" },
  { char: "™", description: "Trademark" },
  { char: "€", description: "Euro" },
  { char: "£", description: "Pound" },
  { char: "¥", description: "Yen" },
  { char: "¢", description: "Cent" },
  { char: "§", description: "Section" },
  { char: "±", description: "Plus-minus" },
  { char: "×", description: "Multiplication" },
  { char: "÷", description: "Division" },
  { char: "≠", description: "Not equal to" },
  { char: "≈", description: "Almost equal to" },
  { char: "≤", description: "Less than or equal to" },
  { char: "≥", description: "Greater than or equal to" },
  { char: "∞", description: "Infinity" },
  { char: "π", description: "Pi" },
  { char: "√", description: "Square root" },
  { char: "∑", description: "Sum" },
  { char: "∫", description: "Integral" },
  { char: "∆", description: "Delta" },
  { char: "Ω", description: "Omega" },
  { char: "α", description: "Alpha" },
  { char: "β", description: "Beta" },
  { char: "µ", description: "Micro" },
  { char: "¶", description: "Paragraph" },
  { char: "•", description: "Bullet" },
  { char: "→", description: "Right arrow" },
  { char: "←", description: "Left arrow" },
  { char: "↑", description: "Up arrow" },
  { char: "↓", description: "Down arrow" },
  { char: "↔", description: "Left-right arrow" },
  { char: "…", description: "Ellipsis" },
  { char: "—", description: "Em dash" },
  { char: "–", description: "En dash" },
  { char: "«", description: "Left double angle quotes" },
  { char: "»", description: "Right double angle quotes" },
  { char: '"', description: "Left double quotation mark" },
  { char: '"', description: "Right double quotation mark" },
  { char: "'", description: "Left single quotation mark" },
  { char: "'", description: "Right single quotation mark" },
];

// Emoji categories
const emojiCategories = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
  ],
  people: [
    "👶",
    "👧",
    "🧒",
    "👦",
    "👩",
    "🧑",
    "👨",
    "👵",
    "🧓",
    "👴",
    "👲",
    "👳‍♀️",
    "👳‍♂️",
    "🧕",
    "👮‍♀️",
    "👮‍♂️",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
  ],
  food: [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
  ],
  activities: [
    "⚽️",
    "🏀",
    "🏈",
    "⚾️",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🥅",
  ],
  travel: [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🚚",
    "🚛",
    "🚜",
    "🛴",
    "🚲",
    "🛵",
    "🏍",
  ],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "♥️",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
  ],
};

const fontFamilyOptions = [
  { value: "Arial", label: "Arial" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Verdana", label: "Verdana" },
  { value: "Roboto", label: "Roboto" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
];

const fontSizeOptions = [
  { value: "8px", label: "8px" },
  { value: "10px", label: "10px" },
  { value: "12px", label: "12px" },
  { value: "14px", label: "14px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px" },
  { value: "30px", label: "30px" },
  { value: "36px", label: "36px" },
  { value: "48px", label: "48px" },
  { value: "60px", label: "60px" },
  { value: "72px", label: "72px" },
];

const colorPresets = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#800000", // Maroon
  "#008080", // Teal
  "#000080", // Navy
  "#808080", // Gray
  "#C0C0C0", // Silver
];

const highlightColors = [
  "#FFFF00", // Yellow
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#FFA500", // Orange
  "#90EE90", // Light Green
  "#ADD8E6", // Light Blue
  "#FFC0CB", // Pink
  "#E6E6FA", // Lavender
];

// Templates
const templates = [
  {
    name: "Blank Document",
    content: `
      <h1>Document Title</h1>
      <p><em>Created on ${new Date().toLocaleDateString()}</em></p>
      <p>Start writing your content here...</p>
      <p>&nbsp;</p>
      <p><strong>Introduction:</strong></p>
      <p>Write an engaging introduction to your document here.</p>
      <p>&nbsp;</p>
      <p><strong>Main Content:</strong></p>
      <p>Use this section to describe your ideas, details, or whatever you want to document.</p>
      <p>&nbsp;</p>
      <p><strong>Conclusion:</strong></p>
      <p>Summarize your points and end the document here.</p>
      <p>&nbsp;</p>
      <p>— End of Document —</p>
    `,
  },
  {
    name: "Business Letter",
    content: `
      <p>[Your Name]</p>
      <p>[Your Address]</p>
      <p>[City, State ZIP]</p>
      <p>[Your Email]</p>
      <p>[Your Phone]</p>
      <p>[Date]</p>
      <p>&nbsp;</p>
      <p>[Recipient Name]</p>
      <p>[Company Name]</p>
      <p>[Street Address]</p>
      <p>[City, State ZIP]</p>
      <p>&nbsp;</p>
      <p>Dear [Recipient Name],</p>
      <p>&nbsp;</p>
      <p>Subject: [Subject of the Letter]</p>
      <p>&nbsp;</p>
      <p>[Body Paragraph 1]</p>
      <p>&nbsp;</p>
      <p>[Body Paragraph 2]</p>
      <p>&nbsp;</p>
      <p>[Body Paragraph 3]</p>
      <p>&nbsp;</p>
      <p>Sincerely,</p>
      <p>&nbsp;</p>
      <p>[Your Name]</p>
    `,
  },
  {
    name: "Meeting Minutes",
    content: `
      <h1>Meeting Minutes</h1>
      <p><strong>Date:</strong> [Meeting Date]</p>
      <p><strong>Time:</strong> [Start Time] - [End Time]</p>
      <p><strong>Location:</strong> [Meeting Location]</p>
      <p>&nbsp;</p>
      <h2>Attendees</h2>
      <ul>
        <li>[Attendee 1]</li>
        <li>[Attendee 2]</li>
        <li>[Attendee 3]</li>
      </ul>
      <p>&nbsp;</p>
      <h2>Agenda Items</h2>
      <ol>
        <li>
          <p><strong>[Agenda Item 1]</strong></p>
          <p>Discussion: [Notes about the discussion]</p>
          <p>Action Items: [Action items related to this agenda item]</p>
        </li>
        <li>
          <p><strong>[Agenda Item 2]</strong></p>
          <p>Discussion: [Notes about the discussion]</p>
          <p>Action Items: [Action items related to this agenda item]</p>
        </li>
      </ol>
      <p>&nbsp;</p>
      <h2>Next Meeting</h2>
      <p><strong>Date:</strong> [Next Meeting Date]</p>
      <p><strong>Time:</strong> [Start Time] - [End Time]</p>
      <p><strong>Location:</strong> [Next Meeting Location]</p>
    `,
  },
  {
    name: "Blog Post",
    content: `
      <h1>[Blog Post Title]</h1>
      <p><em>Published on [Date] by [Author]</em></p>
      <p>&nbsp;</p>
      <p>[Introduction paragraph that hooks the reader and introduces the topic]</p>
      <p>&nbsp;</p>
      <h2>[First Subheading]</h2>
      <p>[Content for the first section]</p>
      <p>&nbsp;</p>
      <h2>[Second Subheading]</h2>
      <p>[Content for the second section]</p>
      <p>&nbsp;</p>
      <h2>[Third Subheading]</h2>
      <p>[Content for the third section]</p>
      <p>&nbsp;</p>
      <h2>Conclusion</h2>
      <p>[Summarize the main points and provide a call to action]</p>
      <p>&nbsp;</p>
      <p><strong>Tags:</strong> [Tag 1], [Tag 2], [Tag 3]</p>
    `,
  },
];

// --- Define outside ---
export const ImageDialog = ({
  open,
  onOpenChange,
  imageUrl,
  imageWidth,
  imageHeight,
  imageAlt,
  imageTitle,
  imageAlignment,
  setImageWidth,
  setImageHeight,
  setImageAlt,
  setImageTitle,
  setImageAlignment,
  insertCustomImage,
  resetImageForm,
}) => (
  <Dialog
    open={open}
    onOpenChange={(o) => {
      if (!o) resetImageForm();
      onOpenChange(o);
    }}
  >
    <DialogContent className="sm:max-w-md" forceMount>
      <DialogHeader>
        <DialogTitle>Insert Image</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        {imageUrl && (
          <div className="flex justify-center mb-4 border rounded p-2">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="max-h-[200px] max-w-full object-contain"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              placeholder="e.g., 300px"
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              placeholder="e.g., 200px"
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="alt">Alt Text</Label>
          <Input
            id="alt"
            placeholder="Accessibility text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Image title"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alignment">Alignment</Label>
          <Select value={imageAlignment} onValueChange={setImageAlignment}>
            <SelectTrigger id="alignment">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={insertCustomImage}>Insert</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

{
  /* Template Dialog */
}
export const TemplateDialog = ({
  templateDialogOpen,
  setTemplateDialogOpen,
  templates,
  applyTemplate,
}) => (
  <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
    <DialogContent className="sm:max-w-md" forceMount>
      <DialogHeader>
        <DialogTitle>Templates</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {templates.map((template, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:bg-accent"
            onClick={() => applyTemplate(template)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.name === "Blank Document"
                  ? "Start with a clean document"
                  : `Template for ${template.name.toLowerCase()}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export const KeetloSmartEditor = ({
  editorId = "default",
  defaultValue = "",
  setValue = {},
  placeholder = "",
  className = "",
  limitRows = 6,
}) => {
  const fileInputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [fontSize, setFontSize] = useState(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const [customHighlightColor, setCustomHighlightColor] = useState("#FFFF00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [specialCharDialogOpen, setSpecialCharDialogOpen] = useState(false);
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
  const [currentEmojiCategory, setCurrentEmojiCategory] = useState("smileys");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [elementPath, setElementPath] = useState([]);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeaderRow, setTableHeaderRow] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const editorContainerRef = useRef(null);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageAlignment, setImageAlignment] = useState("none");
  const [loadingGrammar, setLoadingGrammar] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingAutoFix, setLoadingAutoFix] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsSavedDialogOpen, setSettingsSavedDialogOpen] = useState(false);

  const [hoveredError, setHoveredError] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const grammarDecorationsRef = useRef<Decoration[]>([]);

  const [settings, setSettings] = useState({
    fontFamily: "",
    fontSize: "",
    enableSpellCheck: false,
    enableGrammarCheck: false,
    enableAutoFixErrorsCheck: false,
  });

  useEffect(() => {
    const body = document.body;

    const observer = new MutationObserver(() => {
      if (body.style.pointerEvents === "none") {
        console.log("💥 Pointer events detected on body. Removing...");
        body.style.pointerEvents = ""; // Remove it!
      }
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const CustomImage = TiptapImage.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        alignment: {
          default: "none",
          parseHTML: (element) => element.getAttribute("data-align") || "none",
          renderHTML: (attributes) => {
            if (!attributes.alignment || attributes.alignment === "none")
              return {};
            return { "data-align": attributes.alignment };
          },
        },
        width: {
          default: null,
          parseHTML: (element) => element.getAttribute("width"),
          renderHTML: (attributes) => {
            if (!attributes.width) return {};
            return { width: attributes.width };
          },
        },
        height: {
          default: null,
          parseHTML: (element) => element.getAttribute("height"),
          renderHTML: (attributes) => {
            if (!attributes.height) return {};
            return { height: attributes.height };
          },
        },
      };
    },
  });

  const grammarHighlightPlugin = (getDecorations) => {
    console.log("working");
    return new Plugin<DecorationSet>({
      key: grammarHighlightKey,
      state: {
        init: () => DecorationSet.empty,
        apply(tr, old) {
          const meta = tr.getMeta(grammarHighlightKey);
          if (meta) {
            const decorations = getDecorations().map((match) =>
              Decoration.inline(match.from, match.to, {
                class: match.type.attrs.class,
                title: match.type.attrs.title,
              })
            );
            console.log(decorations);
            return DecorationSet.create(tr.doc, decorations);
          }
          return old.map(tr.mapping, tr.doc);
        },
      },
      props: {
        decorations(state) {
          return this.getState(state);
        },
      },
    });
  };

  const GrammarHighlightExtension = Extension.create({
    name: "grammarHighlight",

    addProseMirrorPlugins() {
      return [grammarHighlightPlugin(() => grammarDecorationsRef.current)];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      GrammarHighlightExtension,
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-4 hover:text-primary/80",
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily,
      FontSize, // Add the FontSize extension here
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      YouTube.configure({
        controls: true,
        nocookie: true,
      }),
      HorizontalRule,
    ],
    content: defaultValue,
    onCreate: ({ editor }) => {
      const saved = localStorage.getItem(`keetloEditorSettings-${editorId}`);
      if (saved) {
        const loadedSettings = JSON.parse(saved);
        setSettings(loadedSettings);

        // Always start fresh focus for each chain!
        if (loadedSettings.fontFamily) {
          editor.chain().focus().setFontFamily(loadedSettings.fontFamily).run();
        }

        if (loadedSettings.fontSize) {
          (editor.chain() as any)
            .focus()
            .setFontSize(loadedSettings.fontSize)
            .insertContent(" ") // 👈 tiny space to "hold" the mark
            .run();
        }
      }

      setLoadingSettings(false);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue?.(html);
      setSourceCode(html);

      // Update word and character count
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);

      // Update element path
      updateElementPath();
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      setSourceCode(editor.getHTML());

      // Set up event listener for keyboard shortcuts
      const handleKeyDown = (event) => {
        // Ctrl+F for search
        if (event.ctrlKey && event.key === "f") {
          event.preventDefault();
          setSearchDialogOpen(true);
        }

        // Ctrl+H for replace
        if (event.ctrlKey && event.key === "h") {
          event.preventDefault();
          setSearchDialogOpen(true);
        }

        // Ctrl+S for save (mock)
        if (event.ctrlKey && event.key === "s") {
          event.preventDefault();
          // Trigger save functionality
          alert("Document saved!");
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleMouseMove = (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("grammar-error")) {
        const rect = target.getBoundingClientRect();
        setHoveredError(target.getAttribute("title"));
        setHoveredPosition({ x: rect.left + rect.width / 2, y: rect.bottom });
      } else {
        setHoveredError(null);
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("mousemove", handleMouseMove);

    return () => {
      dom.removeEventListener("mousemove", handleMouseMove);
    };
  }, [editor]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const initializedRef = useRef(false);
  const getTextFromHtml = (html) => {
    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return "";
  };
  useEffect(() => {
    if (defaultValue && !initializedRef.current) {
      const plainText = getTextFromHtml(defaultValue);
      setCharCount(plainText.length);
      setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
      initializedRef.current = true; // ✅ mark as initialized
    }
  }, [defaultValue]);

  const updateElementPath = () => {
    if (!editor) return;

    const path = [];
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      path.push(node.type.name);
    }

    setElementPath(path);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Open the image dialog for customization
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setImageDialogOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    e.target.value = "";
  };

  const insertCustomImage = () => {
    if (!editor || !imageUrl) return;

    const attrs = {
      src: imageUrl,
      alt: imageAlt,
      title: imageTitle,
      alignment: imageAlignment,
    };

    // Add optional attributes
    if (imageWidth) attrs.width = imageWidth;
    if (imageHeight) attrs.height = imageHeight;

    // Insert the image
    editor.chain().focus().setImage(attrs).run();

    // Reset and close dialog
    setImageDialogOpen(false);
    resetImageForm();
  };

  const resetImageForm = () => {
    setImageUrl("");
    setImageWidth("");
    setImageHeight("");
    setImageAlt("");
    setImageTitle("");
    setImageAlignment("none");
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // In a real app, you would use fetch with actual progress tracking
      // This is a simulation
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Simulate server response
        const serverUrl = `/storage/uploads/${file.name}`;

        // Insert the image with the server URL
        if (editor) {
          editor.chain().focus().setImage({ src: serverUrl }).run();
        }

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!editor) return;

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }

    setLinkDialogOpen(false);
  };

  const handleSearch = () => {
    if (!editor || !searchText) return;

    // This is a simple implementation - in a real app, you'd want to highlight matches
    const text = editor.getText();
    const matches = text.match(new RegExp(searchText, "gi"));
    alert(`Found ${matches ? matches.length : 0} matches`);
  };

  const handleReplace = () => {
    if (!editor || !searchText) return;

    // Simple implementation - replace all instances
    const html = editor.getHTML();
    const newHtml = html.replace(new RegExp(searchText, "gi"), replaceText);
    editor.commands.setContent(newHtml);
    setSearchDialogOpen(false);
    alert("✅ Replacements completed successfully!");
  };

  const insertTable = () => {
    if (!editor) return;
    setTableDialogOpen(false);
    editor
      .chain()
      .focus()
      .insertTable({
        rows: tableRows,
        cols: tableCols,
        withHeaderRow: tableHeaderRow,
      })
      .run();
  };

  const handleYoutubeSubmit = (e) => {
    e.preventDefault();
    if (!editor || !youtubeUrl) return;

    // Extract YouTube ID from URL
    const youtubeRegex =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeUrl.match(youtubeRegex);

    if (match && match[2].length === 11) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: match[2],
          width: 640,
          height: 480,
        })
        .run();
    } else {
      alert("Invalid YouTube URL");
      return;
    }

    setYoutubeDialogOpen(false);
    setYoutubeUrl("");
  };

  const insertSpecialCharacter = (char) => {
    if (!editor) return;
    editor.chain().focus().insertContent(char).run();
    setSpecialCharDialogOpen(false);
  };

  const insertEmoji = (emoji) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
  };

  const applyTemplate = (template) => {
    if (!editor) return;
    editor.commands.setContent(template.content);
    setValue(template.content);
    setTemplateDialogOpen(false);
  };

  const handleSourceCodeChange = (e) => {
    setSourceCode(e.target.value);
  };

  const applySourceCode = () => {
    if (!editor) return;
    editor.commands.setContent(sourceCode);
    setShowSourceCode(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const checkGrammar = async () => {
    if (!editor) return;

    const text = editor.getText();

    if (!text.trim()) {
      alert("⚡ No content to check!");
      return;
    }

    try {
      setLoadingGrammar(true);

      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });

      const data = await res.json();

      // Clear previous highlights
      grammarDecorationsRef.current = [];

      if (!data.matches.length) {
        alert("✅ No grammar issues found!");
        grammarDecorationsRef.current = []; // <--- Clear all highlights
        editor.view.dispatch(
          editor.state.tr.setMeta(grammarHighlightKey, true) // <--- Force decorations refresh
        );
        return;
      }

      grammarDecorationsRef.current = data.matches.map((match) => ({
        from: match.offset,
        to: match.offset + match.length,
        type: {
          attrs: {
            class: "grammar-error",
            title:
              match.message +
              (match.replacements.length
                ? ` → Suggestions: ${match.replacements
                    .map((r) => r.value)
                    .join(", ")}`
                : ""),
          },
          spec: {},
        },
      }));

      editor.view.dispatch(editor.state.tr.setMeta(grammarHighlightKey, true));
    } catch (error) {
      console.error("Grammar check failed:", error);
      alert("❌ Failed to check grammar. Please try again.");
    } finally {
      setLoadingGrammar(false);
    }
  };

  const checkSpelling = async () => {
    if (!editor) return;

    const text = editor.getText();

    if (!text.trim()) {
      alert("⚡ No content to check!");
      return;
    }

    try {
      setLoadingCheck(true);

      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });

      const data = await res.json();

      // Clear previous highlights
      grammarDecorationsRef.current = [];

      const spellingErrors = data.matches.filter(
        (match) => match.rule.issueType === "misspelling"
      );

      if (!spellingErrors.length) {
        alert("✅ No spelling mistakes found!");
        grammarDecorationsRef.current = [];
        editor.view.dispatch(
          editor.state.tr.setMeta(grammarHighlightKey, true)
        );
        return;
      }

      grammarDecorationsRef.current = spellingErrors.map((match) => ({
        from: match.offset,
        to: match.offset + match.length,
        type: {
          attrs: {
            class: "grammar-error",
            title:
              match.message +
              (match.replacements.length
                ? ` → Suggestions: ${match.replacements
                    .map((r) => r.value)
                    .join(", ")}`
                : ""),
          },
          spec: {},
        },
      }));

      editor.view.dispatch(editor.state.tr.setMeta(grammarHighlightKey, true));
    } catch (error) {
      console.error("Spell check failed:", error);
      alert("❌ Failed to check spelling. Please try again.");
    } finally {
      setLoadingCheck(false);
    }
  };

  const autoFixErrors = async () => {
    if (!editor) return;

    const text = editor.getText();

    if (!text.trim()) {
      alert("⚡ No content to fix!");
      return;
    }

    try {
      setLoadingAutoFix(true); // ✅ Start Auto-Fix loading

      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });

      const data = await res.json();

      if (!data.matches.length) {
        alert("✅ No errors found!");
        return;
      }

      const fixes = data.matches
        .filter((match) => match.replacements.length > 0)
        .sort((a, b) => b.offset - a.offset);

      let updatedText = text;

      fixes.forEach((match) => {
        const replacement = match.replacements[0].value;
        updatedText =
          updatedText.slice(0, match.offset) +
          replacement +
          updatedText.slice(match.offset + match.length);
      });

      editor.commands.setContent(updatedText);
      setSourceCode(updatedText);

      alert(`✅ Auto-fixed ${fixes.length} issue(s)!`);
    } catch (error) {
      console.error("Auto-fix failed:", error);
      alert("❌ Failed to auto-fix. Please try again.");
    } finally {
      setLoadingAutoFix(false); // ✅ Stop Auto-Fix loading
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem(
      `keetloEditorSettings-${editorId}`,
      JSON.stringify(settings)
    );
    setSettingsDialogOpen(false);

    if (editor) {
      if (settings.fontFamily) {
        editor.chain().focus().setFontFamily(settings.fontFamily).run();
      }
      if (settings.fontSize) {
        editor
          .chain()
          .focus()
          .setMark("textStyle", { fontSize: settings.fontSize })
          .run();
      }
    }

    setSettingsSavedDialogOpen(true);
  };

  const handlePrint = () => {
    const content = editor.getHTML();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Document</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          img { max-width: 100%; }
          table { border-collapse: collapse; width: 100%; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          @media print {
            @page { margin: 2cm; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const exportAsHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!editor || loadingSettings) return null;

  return (
    <div
      ref={editorContainerRef}
      className={cn(
        "rounded-lg border border-input bg-background shadow-sm",
        isFullscreen &&
          "overflow-y-auto fixed inset-0 z-50 rounded-none border-none",
        className
      )}
    >
      {/* Main Toolbar */}
      <div className="border-b border-input">
        <Tabs defaultValue="format">
          <div className="flex items-center justify-between px-2 border-b flex-wrap">
            <TabsList className="justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="format"
                className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary"
              >
                Format
              </TabsTrigger>
              <TabsTrigger
                value="insert"
                className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary"
              >
                Insert
              </TabsTrigger>
              <TabsTrigger
                value="view"
                className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary"
              >
                View
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary"
              >
                Tools
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowSourceCode(!showSourceCode)}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    {showSourceCode ? "Hide Source" : "Edit HTML Source"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsHTML}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsText}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTemplateDialogOpen(true)}>
                    <FileUp className="h-4 w-4 mr-2" />
                    Templates
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent
            value="format"
            className="flex flex-wrap items-center gap-1 p-2"
          >
            <TooltipProvider delayDuration={300}>
              {/* Text Style Section */}
              <div className="flex items-center gap-1 mr-3">
                <Select
                  onValueChange={(value) =>
                    editor.chain().focus().setFontFamily(value).run()
                  }
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilyOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>
                          {font.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    editor.chain().focus().setFontSize(value).run()
                  }
                >
                  <SelectTrigger className="w-[80px] h-8">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Text Formatting */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("bold") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("italic") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("underline") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                    >
                      <UnderlineIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("strike") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                      }
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Strikethrough</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("superscript") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleSuperscript().run()
                      }
                    >
                      <SuperscriptIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Superscript</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive("subscript") &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().toggleSubscript().run()
                      }
                    >
                      <SubscriptIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Subscript</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Text Color */}
              <div className="flex items-center gap-1 mr-3">
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 relative"
                        >
                          <div
                            className="absolute bottom-1 left-1 right-1 h-1 rounded-sm"
                            style={{ backgroundColor: customColor }}
                          ></div>
                          <Type className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Text Color</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium">Text Color</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {colorPresets.map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "h-6 w-6 rounded-md border border-input",
                              color === "#FFFFFF" && "border-gray-300"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setCustomColor(color);
                              editor.chain().focus().setColor(color).run();
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="h-8 w-8 cursor-pointer rounded-md border-0"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            editor.chain().focus().setColor(customColor).run()
                          }
                        >
                          Apply Color
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            editor.chain().focus().unsetColor().run()
                          }
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 relative"
                        >
                          <div
                            className="absolute bottom-1 left-1 right-1 h-1 rounded-sm"
                            style={{ backgroundColor: customHighlightColor }}
                          ></div>
                          <Highlighter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Highlight Color</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium">Highlight Color</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {highlightColors.map((color) => (
                          <button
                            key={color}
                            className="h-6 w-full rounded-md border border-input"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setCustomHighlightColor(color);
                              editor
                                .chain()
                                .focus()
                                .toggleHighlight({ color })
                                .run();
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="color"
                          value={customHighlightColor}
                          onChange={(e) =>
                            setCustomHighlightColor(e.target.value)
                          }
                          className="h-8 w-8 cursor-pointer rounded-md border-0"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .toggleHighlight({ color: customHighlightColor })
                              .run()
                          }
                        >
                          Apply Highlight
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            editor.chain().focus().unsetHighlight().run()
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Alignment */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: "left" }) &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                      }
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Left</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: "center" }) &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                      }
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Center</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: "right" }) &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                      }
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Right</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        editor.isActive({ textAlign: "justify" }) &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                      }
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Justify</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1 mr-3">
                {["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => (
                  <Tooltip key={level}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8",
                          editor.isActive("heading", {
                            level: parseInt(level.replace("h", "")),
                          }) && "bg-accent text-accent-foreground"
                        )}
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({
                              level: parseInt(level.replace("h", "")),
                            })
                            .run()
                        }
                      >
                        <span className="text-[12px] font-bold uppercase">
                          {level}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Heading {level.toUpperCase()}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </TabsContent>

          <TabsContent
            value="insert"
            className="flex flex-wrap items-center gap-1 p-2"
          >
            <TooltipProvider delayDuration={300}>
              {/* Insert Section */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>

                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            editor.isActive("link") &&
                              "bg-accent text-accent-foreground"
                          )}
                          onClick={() => {
                            // Pre-fill with the current link URL if a link is selected
                            if (editor.isActive("link")) {
                              const attrs = editor.getAttributes("link");
                              setLinkUrl(attrs.href || "https://");
                            } else {
                              setLinkUrl("https://");
                            }
                          }}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Insert Link</TooltipContent>
                  </Tooltip>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLinkSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1"
                            autoFocus
                          />
                          {editor.isActive("link") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                editor.chain().focus().unsetLink().run();
                                setLinkDialogOpen(false);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLinkDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={youtubeDialogOpen}
                  onOpenChange={setYoutubeDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Youtube className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Insert YouTube Video</TooltipContent>
                  </Tooltip>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Insert YouTube Video</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="youtube-url">YouTube URL</Label>
                        <Input
                          id="youtube-url"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          className="flex-1"
                          autoFocus
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setYoutubeDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Insert</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={tableDialogOpen}
                  onOpenChange={setTableDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <TableIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Insert Table</TooltipContent>
                  </Tooltip>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="rows">Rows</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="rows"
                            type="number"
                            min="1"
                            max="20"
                            value={tableRows}
                            onChange={(e) =>
                              setTableRows(Number.parseInt(e.target.value) || 2)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cols">Columns</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="cols"
                            type="number"
                            min="1"
                            max="10"
                            value={tableCols}
                            onChange={(e) =>
                              setTableCols(Number.parseInt(e.target.value) || 2)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="header-row"
                          checked={tableHeaderRow}
                          onCheckedChange={(checked) =>
                            setTableHeaderRow(!!checked)
                          }
                        />
                        <Label htmlFor="header-row">Include header row</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTableDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={insertTable}>
                          Insert
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={specialCharDialogOpen}
                  onOpenChange={setSpecialCharDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pilcrow className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Special Characters</TooltipContent>
                  </Tooltip>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Special Characters</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
                      {specialCharacters.map((item, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-10 w-10 text-lg"
                              onClick={() => insertSpecialCharacter(item.char)}
                            >
                              {item.char}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{item.description}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={emojiDialogOpen}
                  onOpenChange={setEmojiDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Emojis</TooltipContent>
                  </Tooltip>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Emojis</DialogTitle>
                    </DialogHeader>
                    <Tabs
                      defaultValue="smileys"
                      onValueChange={setCurrentEmojiCategory}
                    >
                      <TabsList className="grid grid-cols-7">
                        <TabsTrigger value="smileys">😀</TabsTrigger>
                        <TabsTrigger value="people">👨</TabsTrigger>
                        <TabsTrigger value="animals">🐶</TabsTrigger>
                        <TabsTrigger value="food">🍎</TabsTrigger>
                        <TabsTrigger value="activities">⚽️</TabsTrigger>
                        <TabsTrigger value="travel">🚗</TabsTrigger>
                        <TabsTrigger value="symbols">❤️</TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value={currentEmojiCategory}
                        className="mt-2"
                      >
                        <div className="grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto">
                          {emojiCategories[currentEmojiCategory].map(
                            (emoji, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className="h-10 w-10 text-lg"
                                onClick={() => insertEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            )
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                      }
                    >
                      <div className="w-4 h-px bg-current" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Horizontal Rule</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </TabsContent>

          <TabsContent
            value="view"
            className="flex flex-wrap items-center gap-1 p-2"
          >
            <TooltipProvider delayDuration={300}>
              {/* View Section */}
              <div className="flex items-center gap-1 mr-3">
                <Dialog
                  open={searchDialogOpen}
                  onOpenChange={setSearchDialogOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Find & Replace (Ctrl+F)</TooltipContent>
                  </Tooltip>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Find & Replace</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="search">Find</Label>
                        <Input
                          id="search"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          placeholder="Text to find"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="replace">Replace with</Label>
                        <Input
                          id="replace"
                          value={replaceText}
                          onChange={(e) => setReplaceText(e.target.value)}
                          placeholder="Replacement text"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          onClick={handleSearch}
                          disabled={!searchText}
                        >
                          Find
                        </Button>
                        <div className="space-x-2">
                          <Button
                            type="button"
                            onClick={handleReplace}
                            disabled={!searchText}
                          >
                            Replace All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSearchDialogOpen(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Undo/Redo */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().undo()}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().redo()}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Clipboard */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(editor.getHTML());
                        alert("HTML copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy HTML</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(editor.getText());
                        alert("Text copied to clipboard");
                      }}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Text</TooltipContent>
                </Tooltip>
              </div>

              <div className="ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() =>
                        editor.chain().focus().clearContent().run()
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Content</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </TabsContent>

          <TabsContent
            value="tools"
            className="flex flex-wrap items-center gap-1 p-2"
          >
            <TooltipProvider delayDuration={300}>
              {/* Tools Section */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={checkSpelling}
                      disabled={!settings.enableSpellCheck}
                    >
                      {loadingCheck ? (
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                      ) : (
                        <Spellcheck className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Spell Check</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={checkGrammar}
                      disabled={!settings.enableGrammarCheck}
                    >
                      {loadingGrammar ? (
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grammar Check</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={autoFixErrors}
                      disabled={
                        loadingAutoFix || !settings.enableAutoFixErrorsCheck
                      }
                    >
                      {loadingAutoFix ? (
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                      ) : (
                        <span className="text-xs font-semibold">Fix</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Auto Fix Errors</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        alert(
                          "Word count: " +
                            wordCount +
                            ", Character count: " +
                            charCount
                        )
                      }
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Word Count</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Table Tools */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        editor.chain().focus().addColumnBefore().run()
                      }
                      disabled={!editor.can().addColumnBefore()}
                    >
                      <Columns className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Column Before</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        editor.chain().focus().addColumnAfter().run()
                      }
                      disabled={!editor.can().addColumnAfter()}
                    >
                      <Columns className="h-4 w-4 rotate-180" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Column After</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        editor.chain().focus().deleteColumn().run()
                      }
                      disabled={!editor.can().deleteColumn()}
                    >
                      <Columns className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Column</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        editor.chain().focus().addRowBefore().run()
                      }
                      disabled={!editor.can().addRowBefore()}
                    >
                      <Columns className="h-4 w-4 rotate-90" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Row Before</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      disabled={!editor.can().addRowAfter()}
                    >
                      <Columns className="h-4 w-4 rotate-270" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Row After</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      disabled={!editor.can().deleteRow()}
                    >
                      <Columns className="h-4 w-4 rotate-90 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Row</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().deleteTable().run()}
                      disabled={!editor.can().deleteTable()}
                    >
                      <TableIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Table</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Format Tools */}
              <div className="flex items-center gap-1 mr-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => editor.chain().focus().clearNodes().run()}
                    >
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Formatting</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        alert(
                          "Format painter would copy formatting from selection"
                        )
                      }
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Format Painter</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hidden image uploader */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      {/* Editor Content */}
      <div className="relative">
        {showSourceCode ? (
          <div
            className={`min-h-[250px] p-4 focus-within:ring-1 focus-within:ring-ring`}
          >
            <div className="flex justify-between mb-2">
              <Label htmlFor="source-code">HTML Source</Label>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSourceCode(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={applySourceCode}>
                  Apply
                </Button>
              </div>
            </div>
            <Textarea
              id="source-code"
              value={sourceCode}
              onChange={handleSourceCodeChange}
              className="font-mono text-sm h-[400px]"
            />
          </div>
        ) : (
          <EditorContent
            editor={editor}
            className={cn(
              "p-4 focus-within:ring-1 focus-within:ring-ring",
              className
            )}
            style={{
              ...(isFullscreen
                ? {
                    minHeight: "70dvh",
                  } // no limit when fullscreen
                : {
                    minHeight: limitRows ? `${limitRows * 24}px` : "250px",
                    maxHeight: limitRows ? `${limitRows * 24}px` : undefined,
                    overflowY: limitRows ? "auto" : undefined,
                  }),
            }}
          />
        )}

        {/* Upload progress indicator */}
        {uploading && (
          <div className="absolute bottom-12 right-3 bg-background border rounded-md shadow-md p-2 w-64">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Uploading image...</span>
              <span className="text-xs">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Word/Character count */}
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {wordCount} words | {charCount} characters
        </div>
      </div>

      {/* Element path (breadcrumbs) */}
      <div className="border-t border-input px-3 py-1 text-xs text-muted-foreground flex items-center">
        <span className="mr-2">Path:</span>
        {elementPath.length > 0 ? (
          <div className="flex items-center">
            {elementPath.map((element, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1">›</span>}
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {element}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <span>No selection</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              alert(`
          📖 Keetlo Smart Editor - Quick Help:
          
          🔹 Formatting:
          - Bold: Ctrl+B
          - Italic: Ctrl+I
          - Underline: Ctrl+U
          - Strikethrough: Use the toolbar
          
          🔹 Insert:
          - Image upload (toolbar button)
          - Links: Click link button or Ctrl+K
          - YouTube: Insert YouTube embed link
          - Table: Insert customizable tables
          
          🔹 Shortcuts:
          - Find: Ctrl+F
          - Replace: Ctrl+H
          - Save (simulate): Ctrl+S
          - Undo: Ctrl+Z
          - Redo: Ctrl+Shift+Z
          
          🔹 Other Features:
          - Spell Check, Grammar Check, and Auto Fix (if enabled)
          - Templates (for quick document creation)
          - View/Edit Source Code (HTML)
          - Fullscreen Mode
          - Export as HTML or Text
          - Print Document
          
          ✨ Tip: You can also customize fonts, sizes, colors, and highlight text.
          
          Happy Writing! 🚀
              `)
            }}
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Help
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Image Dialog */}
      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        imageUrl={imageUrl}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        imageAlt={imageAlt}
        imageTitle={imageTitle}
        imageAlignment={imageAlignment}
        setImageWidth={setImageWidth}
        setImageHeight={setImageHeight}
        setImageAlt={setImageAlt}
        setImageTitle={setImageTitle}
        setImageAlignment={setImageAlignment}
        insertCustomImage={insertCustomImage}
        resetImageForm={resetImageForm}
      />

      {/* Template Dialog */}
      <TemplateDialog
        templateDialogOpen={templateDialogOpen}
        setTemplateDialogOpen={setTemplateDialogOpen}
        templates={templates}
        applyTemplate={applyTemplate}
      />

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editor Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Default Font */}
            <div className="space-y-2">
              <Label>Default Font</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, fontFamily: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Default Font Size */}
            <div className="space-y-2">
              <Label>Default Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, fontSize: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose size" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizeOptions.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Spell Check Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spellcheck"
                checked={settings.enableSpellCheck}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableSpellCheck: !!checked,
                  }))
                }
              />
              <Label htmlFor="spellcheck">
                {settings.enableSpellCheck} Enable Spell Check
              </Label>
            </div>

            {/* Grammar Check Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="grammarcheck"
                checked={settings.enableGrammarCheck}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableGrammarCheck: !!checked,
                  }))
                }
              />
              <Label htmlFor="grammarcheck">Enable Grammar Check</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="grammarcheck"
                checked={settings.enableAutoFixErrorsCheck}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableAutoFixErrorsCheck: !!checked,
                  }))
                }
              />
              <Label htmlFor="grammarcheck">Enable Auto Fix Error</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSettingsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSettings({
                  fontFamily: "",
                  fontSize: "",
                  enableSpellCheck: false,
                  enableGrammarCheck: false,
                  enableAutoFixErrorsCheck: false,
                });
              }}
            >
              Reset to Default
            </Button>
            <Button onClick={handleSaveSettings}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={settingsSavedDialogOpen}
        onOpenChange={setSettingsSavedDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>✅ Settings Saved</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Your editor settings have been updated successfully.
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSettingsSavedDialogOpen(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {hoveredError && (
        <div
          className="fixed z-50 bg-background border border-border text-sm rounded-md p-2 shadow-md"
          style={{
            left: hoveredPosition.x,
            top: hoveredPosition.y + 8,
            transform: "translateX(-50%)",
            whiteSpace: "pre-wrap",
            maxWidth: "300px",
          }}
        >
          {hoveredError}
        </div>
      )}

      {/* Add custom styles for the editor */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 250px;
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.375rem;
          display: block;
        }

        .ProseMirror img[style*="width"] {
          width: attr(width);
        }

        .ProseMirror img[style*="height"] {
          height: attr(height);
        }

        .ProseMirror .image-align-left {
          float: left;
          margin-right: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror .image-align-right {
          float: right;
          margin-left: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror .image-align-center {
          margin-left: auto;
          margin-right: auto;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }

        .ProseMirror pre {
          background-color: #f8f9fa;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          font-family: monospace;
          overflow-x: auto;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 2px solid #ced4da;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table th {
          font-weight: bold;
          background-color: #f8f9fa;
        }

        .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror .youtube-video {
          aspect-ratio: 16 / 9;
          width: 100%;
          margin: 1rem 0;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1rem 0;
        }

        .ProseMirror *[data-resizable] {
          position: relative;
        }

        .ProseMirror *[data-resizable] .resize-handle {
          position: absolute;
          right: -4px;
          bottom: -4px;
          width: 8px;
          height: 8px;
          background-color: #0ea5e9;
          border-radius: 50%;
          cursor: nwse-resize;
        }

        .ProseMirror img[data-align="center"] {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .ProseMirror img[data-align="left"] {
          float: left;
          margin-right: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror img[data-align="right"] {
          float: right;
          margin-left: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror .grammar-error {
          text-decoration: underline red wavy;
          cursor: help;
          position: relative;
        }
      `}</style>
    </div>
  );
};
