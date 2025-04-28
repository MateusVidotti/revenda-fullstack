import Navbar from "../components/layout/navbar"
import RecebimentosTable from "../components/tables/RecebimentosTable"
import AddButton from "../components/buttons/AddButton"
function Recebimentos(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Recebimento' url='/recebimento/novo'/>
            <RecebimentosTable/>
        </div>
    )
}

export default Recebimentos