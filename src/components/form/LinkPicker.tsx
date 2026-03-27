import React, { useState, useEffect } from 'react';
import { Link, Globe } from 'lucide-react';
import Input from './input/InputField';

interface LinkOption {
    label: string;
    value: string;
}

const INTERNAL_PAGES: LinkOption[] = [
    { label: "Home", value: "/" },
    { label: "About Us", value: "/about" },
    { label: "Our Story", value: "/about/our-story" },
    { label: "Meet Our Team", value: "/about/meet-our-team" },
    { label: "Strategic Plan", value: "/about/our-strategic-plan" },
    { label: "Services (Overview)", value: "/services" },
    { label: "→ Counseling", value: "/services/grounded-counseling" },
    { label: "→ Educational Programs", value: "/services/educational-programs" },
    { label: "→ Advocacy & Education", value: "/services/advocacy-education" },
    { label: "→ Community Support", value: "/services/community-support" },
    { label: "→ System Navigation", value: "/services/system-navigation" },
    { label: "Events", value: "/impact/events" },
    { label: "Black Excellence Gala", value: "/impact/events/black-excellence-gala" },
    { label: "Impact (Overview)", value: "/impact" },
    { label: "Newsletters", value: "/impact/newsletters" },
    { label: "Success Stories", value: "/impact/success-stories" },
    { label: "Research", value: "/research" },
    { label: "→ Neurodivergent Project", value: "/research/neurodivergent" },
    { label: "Blog", value: "/blog" },
    { label: "Join Us", value: "/join" },
    { label: "→ Funders", value: "/join/funders" },
    { label: "→ Partners", value: "/join/partners" },
    { label: "→ Careers", value: "/join/careers" },
    { label: "→ Volunteer", value: "/join/volunteer" },
    { label: "Contact Us", value: "/contact" },
    { label: "Donate", value: "/donate" },
];

interface LinkPickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

const LinkPicker: React.FC<LinkPickerProps> = ({ value, onChange, label, placeholder }) => {
    const [isExternal, setIsExternal] = useState(false);

    useEffect(() => {
        // Detect if current value is external (starts with http or is not in the list)
        const isKnownInternal = INTERNAL_PAGES.some(p => p.value === value);
        setIsExternal(!isKnownInternal && value !== "" && value !== "/");
    }, [value]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === "external") {
            setIsExternal(true);
        } else {
            setIsExternal(false);
            onChange(val);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <div className="flex flex-col gap-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {isExternal ? <Globe size={16} /> : <Link size={16} />}
                    </div>
                    <select
                        value={isExternal ? "external" : value}
                        onChange={handleSelectChange}
                        className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors"
                    >
                        <option value="">Select an internal page...</option>
                        {INTERNAL_PAGES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                        <option value="external" className="font-bold text-primary">Custom External Link...</option>
                    </select>
                </div>

                {isExternal && (
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder || "https://example.com/..."}
                    />
                )}
            </div>
        </div>
    );
};

export default LinkPicker;
