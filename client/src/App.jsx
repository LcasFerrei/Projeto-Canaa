import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { FiSettings, FiUsers } from "react-icons/fi";
import FormularioPublico from "./pages/FormularioPublico";
import PainelAdmin from "./pages/PainelAdmin";
import DetalheIrmao from "./pages/DetalheIrmao";
import EditarIrmao from "./pages/EditarIrmao";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="top-nav">
        <Link to="/" className="top-nav__link">
          <FiUsers /> Formulário
        </Link>
        <Link to="/admin" className="top-nav__link">
          <FiSettings /> Admin
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<FormularioPublico />} />
        <Route path="/admin" element={<PainelAdmin />} />
        <Route path="/admin/irmao/:id" element={<DetalheIrmao />} />
        <Route path="/admin/irmao/:id/editar" element={<EditarIrmao />} />
      </Routes>
    </BrowserRouter>
  );
}
