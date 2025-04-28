import Navbar from "../components/layout/navbar"
import ProdutosTable from "../components/tables/ProdutosTable"
import AddButton from "../components/buttons/AddButton"
function Produtos(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Produto' url='/produto/novo'/>
            <ProdutosTable/>
        </div>
    )
}

export default Produtos