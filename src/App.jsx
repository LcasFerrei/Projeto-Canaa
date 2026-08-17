import { Routes, Route } from "react-router-dom";
import CadastroForm from "./pages/CadastroForm";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import AdminFormBuilder from "./pages/AdminFormBuilder";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CadastroForm />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/configuracoes" element={<AdminSettings />} />
      <Route path="/admin/configuracoes/formulario" element={<AdminFormBuilder />} />
    </Routes>
  );
}
