import React, { useState, useRef, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.snow.css';
import Label from './Label';
import MediaLibrary from '../common/MediaLibrary';
import BlotFormatter from 'quill-blot-formatter';
import Quill from 'quill';

// @ts-ignore
if (Quill && !Quill.imports['modules/blotFormatter']) {
    Quill.register('modules/blotFormatter', BlotFormatter);
}

interface RichTextEditorProps {
    label?: string;  // Optional — not all usages need a visible label
    value: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
    const quillRef = useRef<ReactQuill>(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const imageHandler = useCallback(() => {
        setIsMediaModalOpen(true);
    }, []);

    const modules = useMemo(() => ({
        blotFormatter: {},
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [imageHandler]);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'blockquote', 'list', 'align', 'link', 'image'
    ];

    const handleMediaSelect = (url: string) => {
        setIsMediaModalOpen(false);
        const editor = (quillRef.current as any)?.getEditor();
        if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', url);
            editor.setSelection(range.index + 1, 0); // Move cursor right after the embedded image
        }
    };

    return (
        <div className="flex flex-col gap-2 relative">
            {label && <Label>{label}</Label>}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    className="h-64 mb-12 text-gray-900 dark:text-gray-100" 
                />
            </div>

            <MediaLibrary 
                isOpen={isMediaModalOpen} 
                onClose={() => setIsMediaModalOpen(false)} 
                onSelect={handleMediaSelect} 
            />
        </div>
    );
}
