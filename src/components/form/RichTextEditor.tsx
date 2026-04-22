"use client";

import dynamic from "next/dynamic";
import type { RichTextEditorProps } from "./RichTextEditorClient";

const RichTextEditorClient = dynamic(() => import("./RichTextEditorClient"), { 
    ssr: false, 
    loading: () => <div className="h-64 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg">Loading Editor...</div> 
});

export default function RichTextEditor(props: RichTextEditorProps) {
    return <RichTextEditorClient {...props} />;
}
