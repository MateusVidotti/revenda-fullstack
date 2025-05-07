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
import Ressuprimentos from './pages/Ressuprimentos'
import RessuprimentoForm from "./components/forms/RessuprimentoForm"
import Pedidos from './pages/Pedidos'
import PedidoForm from "./components/forms/PedidoForm"


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
          path="/ressuprimentos"
          element={
            <ProtectedRoute>
              <Ressuprimentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ressuprimento/novo"
          element={
            <ProtectedRoute>
              <RessuprimentoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ressuprimento/editar/:id"
          element={
            <ProtectedRoute>
              <RessuprimentoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedido/novo"
          element={
            <ProtectedRoute>
              <PedidoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedido/editar/:id"
          element={
            <ProtectedRoute>
              <PedidoForm />
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
