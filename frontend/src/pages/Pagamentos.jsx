import Navbar from "../components/layout/navbar"
import PagamentosTable from "../components/tables/PagamentosTable"
import AddButton from "../components/buttons/AddButton"
function Pagamentos(){
    return(
        <>
            <Navbar/>
            <AddButton label='Pagamento' url='/pagamento/novo'/>
            <PagamentosTable/>
        </>
    )
}

export default Pagamentos