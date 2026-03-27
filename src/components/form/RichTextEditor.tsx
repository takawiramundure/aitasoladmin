import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Label from './Label';

interface RichTextEditorProps {
    label: string;
    value: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'blockquote', 'list', 'align', 'link'
    ];

    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    className="h-64 mb-12 text-gray-900 dark:text-gray-100" // mb-12 to account for toolbar height
                />
            </div>
        </div>
    );
}
