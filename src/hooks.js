import "./hooks.css"
import {
    Outlet,
    Link
} from 'react-router-dom'
import UseEffect from "./Hooks/UseEffect"
import UseState from "./Hooks/UseState"
import UseRef from "./Hooks/UseRef"
import UseContext from "./Hooks/UseContext"
import UseReducer from "./Hooks/UseReducer"

function HookBody() {
    return (
        <div className="Display" >
            <Outlet />
        </div>
    );
}
function DefaultCompo() {
    return (
        <>
            <h1>This is Hooks tab </h1>
            <h2>Select Any one Hook available</h2>
        </>
    )
}
function HookNavigator() {
    return (
        <div className="Tab-container">
            <div className="Link-Container"><Link className="link" to="/hooks/UseState" >useState</Link> </div>
            <div className="Link-Container"><Link className="link" to="/hooks/UseEffect" >useEffect</Link> </div>
            <div className="Link-Container"> <Link className="link" to="/hooks/UseRef" >useRef</Link> </div>
            <div className="Link-Container"><Link className="link" to="/hooks/UseContext" >useContext</Link> </div>
            <div className="Link-Container"> <Link className="link" to="/hooks/UseReducer" >useReducer</Link> </div>
        </div>
    )
}


export default function Hooks() {
    return (
        <div className="Parent">

            <HookNavigator />
            <HookBody />

        </div>
    );
}

