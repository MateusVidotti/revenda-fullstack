import Navbar from "../components/layout/navbar"
import FornecedoresTable from "../components/tables/FornecedoresTable"
import AddButton from "../components/buttons/AddButton"
function Fornecedores(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Fornecedor' url='/fornecedor/novo'/>
            <FornecedoresTable/>
        </div>
    )
}

export default Fornecedores