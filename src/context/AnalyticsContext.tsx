import React, { createContext, useContext, useEffect, useState } from 'react';
import { initGoogleClient, setAccessToken, getAnalyticsReport, getDemographicsReport, getTopPagesReport, getDeviceCategoryReport, getEngagementReport } from '../services/analyticsService';
import { useGoogleLogin } from '@react-oauth/google';
import { ANALYTICS_CONFIG } from '../config/analyticsConfig';

interface AnalyticsContextType {
    isConnected: boolean;
    isInitialized: boolean;
    propertyId: string;
    setPropertyId: (id: string) => void;
    connect: () => void;
    disconnect: () => void;
    analyticsData: any | null;
    demographicsData: any | null;
    topPagesData: any | null;
    deviceData: any | null;
    engagementData: any | null;
    fetchData: () => Promise<void>;
    loadingData: boolean;
    error: string | null;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
    isConnected: false,
    isInitialized: false,
    propertyId: '',
    setPropertyId: () => { },
    connect: () => { },
    disconnect: () => { },
    analyticsData: null,
    demographicsData: null,
    topPagesData: null,
    deviceData: null,
    engagementData: null,
    fetchData: async () => { },
    loadingData: false,
    error: null,
});

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [propertyId, setPropertyId] = useState(localStorage.getItem('ga4_property_id') || ANALYTICS_CONFIG.DEFAULT_PROPERTY_ID);
    const [analyticsData, setAnalyticsData] = useState<any | null>(null);
    const [demographicsData, setDemographicsData] = useState<any | null>(null);
    const [topPagesData, setTopPagesData] = useState<any | null>(null);
    const [deviceData, setDeviceData] = useState<any | null>(null);
    const [engagementData, setEngagementData] = useState<any | null>(null);

    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('ga_access_token'));

    useEffect(() => {
        const initialize = async () => {
            // ... existing initialization code
            try {
                await initGoogleClient();
                setIsInitialized(true);

                if (token) {
                    setAccessToken(token);
                    setIsConnected(true);
                }
            } catch (error) {
                console.error("Failed to initialize Google Analytics client", error);
                setError("Failed to initialize Google API. Please refresh capabilities.");
            }
        };
        initialize();
    }, []);

    useEffect(() => {
        if (propertyId) {
            localStorage.setItem('ga4_property_id', propertyId);
        }
    }, [propertyId]);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {

            const accessToken = tokenResponse.access_token;
            setAccessToken(accessToken);
            setToken(accessToken);
            localStorage.setItem('ga_access_token', accessToken);
            setIsConnected(true);
            setError(null);
        },
        onError: (errorResponse) => {
            console.error("Login Failed:", errorResponse);
            setError("Login Failed. Please try again.");
        },
        scope: ANALYTICS_CONFIG.SCOPES,
    });

    const connect = () => {
        setError(null);
        login();
    };

    const disconnect = () => {
        setError(null);
        setToken(null);
        localStorage.removeItem('ga_access_token');
        setAccessToken('');
        setIsConnected(false);
        setAnalyticsData(null);
        setDemographicsData(null);
        setTopPagesData(null);
        setDeviceData(null);
        setEngagementData(null);
    };

    const fetchData = async () => {
        if (!propertyId) {
            setError("Please enter a Property ID.");
            return;
        }
        setLoadingData(true);
        setError(null);
        try {
            if (token) setAccessToken(token);

            // Fetch ALL reports in parallel
            const [reportData, demoData, pagesData, devicesData, engageData] = await Promise.all([
                getAnalyticsReport(propertyId),
                getDemographicsReport(propertyId),
                getTopPagesReport(propertyId),
                getDeviceCategoryReport(propertyId),
                getEngagementReport(propertyId)
            ]);

            setAnalyticsData(reportData);
            setDemographicsData(demoData);
            setTopPagesData(pagesData);
            setDeviceData(devicesData);
            setEngagementData(engageData);

        } catch (error: any) {
            console.error("Failed to fetch analytics data", error);
            if (error?.result?.error?.code === 401 || error?.status === 401) {
                setError("Session expired. Please reconnect.");
                disconnect();
            } else {
                setError("Failed to fetch data. " + (error?.result?.error?.message || error?.message || JSON.stringify(error)));
            }
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <AnalyticsContext.Provider value={{
            isConnected,
            isInitialized,
            propertyId,
            setPropertyId,
            connect,
            disconnect,
            analyticsData,
            demographicsData,
            topPagesData,
            deviceData,
            engagementData,
            fetchData,
            loadingData,
            error
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => useContext(AnalyticsContext);
