import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Settings from "./pages/Settings";
import SiteSettingsManager from "./pages/Settings/SiteSettingsManager";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ContentManager from "./pages/CMS/ContentManager";
import HomePageManager from "./pages/CMS/HomePageManager";
import AboutPageManager from "./pages/CMS/AboutPageManager";
import OurStoryManager from "./pages/CMS/OurStoryManager";
import HeroManager from "./pages/CMS/HeroManager";
import UnderstandingManager from "./pages/CMS/UnderstandingManager";
import CopingManager from "./pages/CMS/CopingManager";
import CrisisManager from "./pages/CMS/CrisisManager";
import ProgramsManager from "./pages/CMS/ProgramsManager";
import ResourcesManager from "./pages/CMS/ResourcesManager";
import MediaManager from "./pages/CMS/MediaManager";
import EventsManager from "./pages/CMS/EventsManager";
import VideoManager from "./pages/CMS/VideoManager";
import PartnerManager from "./pages/CMS/PartnerManager";
import ProductManager from "./pages/CMS/ProductManager";
import BlogManager from "./pages/CMS/BlogManager";
import FooterManager from "./pages/CMS/FooterManager";
import SuicideFactsManager from "./pages/CMS/SuicideFactsManager";
import UserManagement from "./pages/Users/UserManagement";
import { AuthProvider } from "./context/AuthContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { SiteProvider } from "./context/SiteContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ANALYTICS_CONFIG } from "./config/analyticsConfig";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={ANALYTICS_CONFIG.CLIENT_ID}>
      <AuthProvider>
        <SiteProvider>
          <AnalyticsProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Dashboard Layout - Protected */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index path="/" element={<Home />} />

                    {/* CMS Routes */}
                    <Route path="/cms/home-settings" element={<HomePageManager />} />
                    <Route path="/cms/about" element={<AboutPageManager />} />
                    <Route path="/cms/our-story" element={<OurStoryManager />} />
                    <Route path="/cms/hero" element={<HeroManager />} />
                    <Route path="/cms/understanding" element={<UnderstandingManager />} />
                    <Route path="/cms/coping" element={<CopingManager />} />
                    <Route path="/cms/programs" element={<ProgramsManager />} />
                    <Route path="/cms/crisis-support" element={<CrisisManager />} />
                    <Route path="/cms/resources" element={<ResourcesManager />} />
                    <Route path="/cms/media" element={<MediaManager />} />
                    <Route path="/cms/videos" element={<VideoManager />} />
                    <Route path="/cms/partners" element={<PartnerManager />} />
                    <Route path="/cms/upcoming-events" element={<EventsManager />} />
                    <Route path="/cms/blog" element={<BlogManager />} />
                    <Route path="/cms/shop" element={<ProductManager />} />
                    <Route path="/cms/footer" element={<FooterManager />} />
                    <Route path="/cms/suicide-facts" element={<SuicideFactsManager />} />
                    <Route path="/cms/:pageId" element={<ContentManager />} />
                    <Route path="/users" element={<UserManagement />} />

                    {/* Others Page */}
                    <Route path="/profile" element={<UserProfiles />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/site" element={<SiteSettingsManager />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/blank" element={<Blank />} />

                    {/* Forms */}
                    <Route path="/form-elements" element={<FormElements />} />

                    {/* Tables */}
                    <Route path="/basic-tables" element={<BasicTables />} />

                    {/* Ui Elements */}
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/avatars" element={<Avatars />} />
                    <Route path="/badge" element={<Badges />} />
                    <Route path="/buttons" element={<Buttons />} />
                    <Route path="/images" element={<Images />} />
                    <Route path="/videos" element={<Videos />} />

                    {/* Charts */}
                    <Route path="/line-chart" element={<LineChart />} />
                    <Route path="/bar-chart" element={<BarChart />} />
                  </Route>
                </Route>

                {/* Auth Layout */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AnalyticsProvider>
        </SiteProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
