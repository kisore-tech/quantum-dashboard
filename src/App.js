import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Backends from "./pages/Backends";
import Jobs from "./pages/Jobs";
import Sessions from "./pages/Sessions";
import ApiExplorer from "./pages/ApiExplorer";
import { HARDCODED } from "./data";
import AIAssistantDrawer from "./components/AIAssistantDrawer";

import{
   BrowserRouter as Router,
   Routes,
   Route,
 
 }from "react-router-dom";

export default function App() {
  const [data, setData] = useState(HARDCODED);
  const [aiOpen, setAiOpen] = useState(false);

  const [apiKeys, setApiKeys] = useState([{ label: "Demo Key", key: "ibm_xxx_demo" }]);
  const [selectedKey, setSelectedKey] = useState(apiKeys[0].label);

  const handleAddKey = ({ label, key }) => {
    const next = [...apiKeys, { label, key }];
    setApiKeys(next);
    setSelectedKey(label);
  };

  const handleRefresh = () => {
    // Simulate data change
   
  };

  

  return (
    <>
      <Router>
      <Layout
        onRefresh={handleRefresh}
        onOpenAI={() => setAiOpen(true)}
        apiKeys={apiKeys}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        onAddKey={handleAddKey}
      > 
     
        <Routes>
          <Route path="/" element={<Dashboard data={data} />} />
          <Route path="/backends" element={<Backends items={data.backends} />} />
          <Route path="/jobs" element={<Jobs items={data.jobs} />} />
          <Route path="/sessions" element={<Sessions items={data.sessions} />} />
          <Route path="/api" element={<ApiExplorer endpoints={data.endpoints} />} />
          </Routes>
        
      </Layout>
      </Router>

      <AIAssistantDrawer open={aiOpen} onClose={() => setAiOpen(false)} data={data} />
    </>
  );
}