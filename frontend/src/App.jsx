import Router from "./Router/routes";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layout/Layout";

function App() {
  return (
    <>
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default App;
