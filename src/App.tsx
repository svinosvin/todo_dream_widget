import { useEffect } from "react";
import "./App.css";
import { useAppStore } from "./store/appStore";
import { TabBar } from "./components/TabBar";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { TableView } from "./components/TableView";
import { SkillsView } from "./components/SkillsView";
import { LevelsView } from "./components/LevelsView";

function App() {
  const { activeTab, dbReady, loadAll } = useAppStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!dbReady) {
    return (
      <div className="h-screen flex items-center justify-center widget-shell paper-bg">
        <span className="text-text-muted text-lg font-hand">loading...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col widget-shell paper-bg">
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
