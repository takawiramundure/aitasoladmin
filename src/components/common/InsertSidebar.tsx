"use client";

import React, { useState } from "react";
import { X, Search, Pin, Sparkles, Plus, Grid, Layers, Layers2, Compass, Menu, Database, Star, Image, Share2, Shield, Settings, Sliders, Palette, Info } from "lucide-react";
import Input from "@/components/form/input/InputField";

interface InsertSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  reusableComponents: any[];
  onAddReusable: (comp: any) => void;
  onAddBlankSection: (title: string) => void;
}

type CategoryItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
};

type Group = {
  title: string;
  items: CategoryItem[];
};

export default function InsertSidebar({
  isOpen,
  onClose,
  reusableComponents,
  onAddReusable,
  onAddBlankSection,
}: InsertSidebarProps) {
  const [activeTab, setActiveTab] = useState("sections");
  const [searchQuery, setSearchQuery] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const groups: Group[] = [
    {
      title: "Basics",
      items: [
        { id: "sections", name: "Sections", icon: <Layers className="w-4 h-4" /> },
        { id: "navigation", name: "Navigation", icon: <Compass className="w-4 h-4" />, comingSoon: true },
        { id: "menus", name: "Menus", icon: <Menu className="w-4 h-4" />, comingSoon: true },
      ],
    },
    {
      title: "CMS",
      items: [
        { id: "collections", name: "Collections", icon: <Database className="w-4 h-4" />, comingSoon: true },
        { id: "fields", name: "Fields", icon: <Sliders className="w-4 h-4" />, comingSoon: true },
      ],
    },
    {
      title: "Elements",
      items: [
        { id: "icons", name: "Icons", icon: <Star className="w-4 h-4" />, comingSoon: true },
        { id: "shaders", name: "Shaders", icon: <Palette className="w-4 h-4" />, comingSoon: true },
        { id: "media", name: "Media", icon: <Image className="w-4 h-4" />, comingSoon: true },
        { id: "forms", name: "Forms", icon: <Sliders className="w-4 h-4" />, comingSoon: true },
        { id: "interactive", name: "Interactive", icon: <Sparkles className="w-4 h-4" />, comingSoon: true },
        { id: "social", name: "Social", icon: <Share2 className="w-4 h-4" />, comingSoon: true },
        { id: "utility", name: "Utility", icon: <Shield className="w-4 h-4" />, comingSoon: true },
        { id: "creative", name: "Creative", icon: <Palette className="w-4 h-4" />, comingSoon: true },
      ],
    },
  ];

  const handleAddBlank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    onAddBlankSection(newSectionTitle.trim());
    setNewSectionTitle("");
  };

  const filteredReusable = reusableComponents.filter((comp) => {
    const label = comp.reusableLabel || comp.heading || comp.title || comp.id || "";
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-[480px] max-w-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Left Menu Panel */}
      <div className="w-[160px] bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between py-6">
        <div className="space-y-6">
          <div className="px-4 flex items-center gap-2">
            <Layers2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-white">Insert</span>
          </div>

          <div className="space-y-4 px-2">
            {groups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">
                  {group.title}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.comingSoon && setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === item.id && !item.comingSoon
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      } ${item.comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.comingSoon && (
                        <span className="text-[8px] scale-90 font-semibold bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-500">
                          Soon
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 flex items-center gap-2 text-xs text-gray-400">
          <Info className="w-4 h-4" />
          <span>Framer Canvas</span>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-white">
            {activeTab === "sections" ? "Sections & Components" : "Insert Element"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "sections" ? (
            <>
              {/* Add Blank Section Form */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Add Custom Text-Based Section</h4>
                <form onSubmit={handleAddBlank} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="e.g. About Section"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </form>
              </div>

              {/* Reusable Library Components */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Reusable Component Library</h4>
                  <span className="text-[10px] text-gray-400">{filteredReusable.length} items</span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:border-brand-500 dark:text-white"
                  />
                </div>

                {/* List items */}
                {filteredReusable.length > 0 ? (
                  <div className="grid gap-3">
                    {filteredReusable.map((comp) => {
                      const label = comp.reusableLabel || comp.heading || comp.title || comp.id;
                      return (
                        <div
                          key={comp.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                              <Pin className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-semibold text-gray-800 dark:text-white">{label}</p>
                              <p className="text-[10px] text-gray-400 line-clamp-1">
                                {comp.content ? comp.content.replace(/<[^>]*>/g, "") : "Static component structure"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onAddReusable(comp)}
                            className="p-1 text-xs text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded font-semibold flex items-center gap-1 shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-gray-400 italic">
                    No matching reusable components found.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-8 h-8 text-gray-400 animate-pulse mb-3" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Coming Soon</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                Adding layout grids, menus, navigation items is coming in a future update!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
