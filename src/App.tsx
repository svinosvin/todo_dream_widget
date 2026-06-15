import "./App.css";
import { useAppStore } from "./store/appStore";
import { TabBar } from "./components/TabBar";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { TableView } from "./components/TableView";
import { SkillsView } from "./components/SkillsView";
import { LevelsView } from "./components/LevelsView";

function App() {
  const { activeTab } = useAppStore();

  return (
    <div className="h-screen flex flex-col bg-bg paper-bg">
      <TabBar />
      {activeTab === "tasks" && <Header />}
      {activeTab === "table" && <TableView />}
      {activeTab === "tasks" && <TaskList />}
      {activeTab === "skills" && <SkillsView />}
      {activeTab === "lvls" && <LevelsView />}
    </div>
  );
}

export default App;
