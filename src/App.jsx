import DashboardLayout from "./layout/DashboardLayout";
import ContentRenderer from "./dashboard/main_links/ContentRenderer";

function App() {
  return (
    <DashboardLayout>
      <ContentRenderer />
    </DashboardLayout>
  );
}

export default App;
