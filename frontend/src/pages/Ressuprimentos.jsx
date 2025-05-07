import Navbar from "../components/layout/navbar"
import RessuprimentosTable from "../components/tables/RessuprimentosTable"
import AddButton from "../components/buttons/AddButton"
function Ressuprimentos(){
    return(
        <div>
            <Navbar/>
            <AddButton label='Ressuprimento' url='/ressuprimento/novo'/>
            <RessuprimentosTable/>
        </div>
    )
}

export default Ressuprimentos