import Navbar from "../components/layout/navbar"
import ClientesTable from "../components/tables/ClientesTable"
import AddButton from "../components/buttons/AddButton"
function Clientes(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Cliente' url='/cliente/novo'/>
            <ClientesTable/>
        </div>
    )
}

export default Clientes