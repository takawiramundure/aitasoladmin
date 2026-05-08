"use client";

import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import TrafficChart from "@/components/ecommerce/TrafficChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import DeviceStats from "@/components/ecommerce/DeviceStats";
import TopPagesTable from "@/components/ecommerce/TopPagesTable";
import PageMeta from "@/components/common/PageMeta";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/common/SortableItem";
import { FirestoreService } from "@/services/firestore";
import { SEED_DATA } from "@/config/seedData";
import { SETTINGS_SEED_DATA } from "@/config/settingsSeedData";
import { SITES } from "@/config/sites";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { auth } from "@/firebaseConfig";
import { useDialog } from "@/context/DialogContext";

export default function Home() {
  const { isConnected, connect, propertyId, fetchData, analyticsData, demographicsData, topPagesData, deviceData, engagementData, loadingData, error } = useAnalytics();
  const { confirm, alert: dialogAlert } = useDialog();

  // Widget IDs
  const defaultWidgets = ['traffic', 'devices', 'pages', 'demographics'];
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('dashboard_widget_order');
    return savedOrder ? JSON.parse(savedOrder) : defaultWidgets;
  });

  useEffect(() => {
    if (isConnected && propertyId) {
      if (!analyticsData) fetchData();
    }
  }, [isConnected, propertyId]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        localStorage.setItem('dashboard_widget_order', JSON.stringify(newOrder));
        return newOrder;
      });
    }
  }

  const renderWidget = (id: string) => {
    switch (id) {
      case 'traffic': return <TrafficChart data={analyticsData} />;
      case 'devices': return <DeviceStats data={deviceData} />;
      case 'pages': return <TopPagesTable data={topPagesData} />;
      case 'demographics': return <DemographicCard data={demographicsData} />;
      default: return null;
    }
  };

  const getWidgetClass = (id: string) => {
    // Traffic and Pages take up 8 columns (2/3 width)
    if (id === 'traffic' || id === 'pages') return "col-span-12 lg:col-span-8";
    // Devices and Demographics take up 4 columns (1/3 width)
    return "col-span-12 lg:col-span-4";
  };

  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSeedData = async () => {
    const isConfirmed = await confirm({
      title: "Seed Master Data",
      message: "This will overwrite existing content for ALL sites with the real-world defaults. Are you sure you want to proceed?",
      variant: "warning",
      confirmLabel: "Seed All Data"
    });

    if (!isConfirmed) return;

    setSeeding(true);
    setSeedStatus(null);
    try {
      console.log("Starting seeding process...");
      console.log("Current User:", auth.currentUser?.email, "UID:", auth.currentUser?.uid);
      for (const site of SITES) {
        setSeedStatus({ type: 'success', msg: `Seeding ${site.name} content...` });
        const siteData = SEED_DATA[site.id as keyof typeof SEED_DATA];
        if (siteData) {
          for (const [pageId, content] of Object.entries(siteData)) {
            console.log(`Seeding page: ${pageId} for site: ${site.id}`);
            await FirestoreService.savePageContent(pageId, content as any, site.id);
          }
        }

        // Seed settings
        setSeedStatus({ type: 'success', msg: `Seeding ${site.name} settings...` });
        const siteSettings = SETTINGS_SEED_DATA[site.id];
        if (siteSettings) {
          console.log(`Seeding settings for site: ${site.id}`);
          await FirestoreService.saveSiteSettings(site.id, siteSettings);
        }
      }
      setSeedStatus({ type: 'success', msg: "Successfully seeded all site content and settings with real-world data!" });
    } catch (err) {
      console.error("Seeding error:", err);
      setSeedStatus({ type: 'error', msg: `Failed to seed data: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Dashboard | NSPC Admin"
        description="NSPC Admin Dashboard"
      />

      <div className="mb-6 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Google Analytics Integration</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {!isConnected ? (
          <div className="flex items-center gap-4">
            <button
              onClick={connect}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Connect Google Analytics
            </button>
            <a
              href="https://analytics.google.com/analytics/web/#/a341839307p509768055/reports/dashboard?r=reporting-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Visit Online View
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-green-500 font-medium">✓ Connected to Google</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Property ID: <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{propertyId}</span>
              </div>
              <button
                onClick={fetchData}
                disabled={loadingData || !propertyId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingData ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 p-6 bg-white rounded-lg shadow dark:bg-gray-800 border border-blue-100 dark:border-blue-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Site Data Initialization</h2>
            <p className="text-sm text-gray-500 mt-1">
              Initialize your Firestore database with real-world content for all sites.
            </p>
          </div>
          <Button
            onClick={handleSeedData}
            disabled={seeding}
            className="whitespace-nowrap"
          >
            {seeding ? "Seeding..." : "Seed Real-World Content"}
          </Button>
        </div>

        {seedStatus && (
          <div className="mt-4">
            <Alert
              variant={seedStatus.type}
              title={seedStatus.type === 'success' ? "Success" : "Error"}
              message={seedStatus.msg}
            />
          </div>
        )}
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6">
            <EcommerceMetrics data={analyticsData} engagement={engagementData} />
          </div>

          <SortableContext
            items={widgetOrder}
            strategy={verticalListSortingStrategy}
          >
            {widgetOrder.map((id) => (
              <SortableItem key={id} id={id} className={getWidgetClass(id)}>
                {renderWidget(id)}
              </SortableItem>
            ))}
          </SortableContext>

        </div>
      </DndContext>
    </>
  );
}
