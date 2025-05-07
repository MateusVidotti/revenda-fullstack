import Navbar from "../components/layout/navbar"
import PedidosTable from "../components/tables/PedidosTable"
import AddButton from "../components/buttons/AddButton"
function Pedidos(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Pedido' url='/pedido/novo'/>
            <PedidosTable/>
        </div>
    )
}

export default Pedidos