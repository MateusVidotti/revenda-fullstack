import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Painel from "./pages/Painel"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Clientes from './pages/Clientes'
import ClienteForm from "./components/forms/ClienteForm"
import Produtos from './pages/Produtos'
import ProdutoForm from "./components/forms/ProdutoForm"
import Pagamentos from './pages/Pagamentos'
import PagamentoForm from "./components/forms/PagamentoForm"
import Recebimentos from './pages/Recebimentos'
import RecebimentoForm from "./components/forms/RecebimentoForm"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Painel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/painel"
          element={
            <ProtectedRoute>
              <Painel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente/novo"
          element={
            <ProtectedRoute>
              <ClienteForm />
            </ProtectedRoute>
          }
        />
        <Route path="/cliente/editar/:id"        element={
            <ProtectedRoute>
              <ClienteForm />
            </ProtectedRoute>
          } />
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <Produtos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produto/novo"
          element={
            <ProtectedRoute>
              <ProdutoForm />
            </ProtectedRoute>
          }
        />
        <Route path="/produto/editar/:id"        element={
            <ProtectedRoute>
              <ProdutoForm />
            </ProtectedRoute>
          } />
        <Route
          path="/pagamentos"
          element={
            <ProtectedRoute>
              <Pagamentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagamento/novo"
          element={
            <ProtectedRoute>
              <PagamentoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagamento/editar/:id"
          element={
            <ProtectedRoute>
              <PagamentoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recebimentos"
          element={
            <ProtectedRoute>
              <Recebimentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recebimento/novo"
          element={
            <ProtectedRoute>
              <RecebimentoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recebimento/editar/:id"
          element={
            <ProtectedRoute>
              <RecebimentoForm />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
