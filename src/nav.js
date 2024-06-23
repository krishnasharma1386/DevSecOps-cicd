import "./nav.css"
import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <>
            <nav>
                <ul>
                    <li><Link className="link" to="/" >Home</Link></li>
                    <li><Link className="link" to="./about">About</Link></li>
                    <li><Link className="link" to="./contact" >Contact</Link></li>
                    <li><Link className="link" to='./hooks/UseState'>Hooks</Link></li>
                </ul>
            </nav>
        </>
    );
}