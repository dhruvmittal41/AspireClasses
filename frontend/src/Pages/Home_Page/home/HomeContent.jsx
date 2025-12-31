import DashboardView from "../dashboard/Dashboardview";
import MyTestsView from "../my-tests/MyTestsView";
import TestScheduleView from "../TestSchedule/TestScheduleView";
import ResultsView from "../results/ResultsView";
import AskADoubtView from "../AskDoubt/AskdoubtView";
import ProfileView from "../profile/Profile";
import "./Home_Page.css";
const VIEW_MAP = {
  Dashboard: DashboardView,
  "My Tests": MyTestsView,
  "Get Tests": TestScheduleView,
  Results: ResultsView,
  "Ask a Doubt": AskADoubtView,
  Profile: ProfileView,
};

const HomeContent = ({ activeItem }) => {
  const View = VIEW_MAP[activeItem] || DashboardView;
  return <View />;
};

export default HomeContent;
