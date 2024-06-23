import { useState, useRef, useEffect } from "react"

export default function UseRef() {
    const [state, setState] = useState(0)
    const ref = useRef(0);
    const ren = useRef(0)
    useEffect(() => {
        ren.current = ren.current + 1
    })
    return (
        <>
            <cite>The Value of useRef will update when the state changes,<br />so clicking the Ref Increment button won't reflect changes but as soon as the State increment button is clicked<br />the useRef is updated and hence useRef's change in value doesn't cause the re-render</cite>
            <h1>Times Rendered: {ren.current}</h1>
            <h1>I am useState: {state}</h1>
            <h1>I am useRef: {ref.current}</h1>
            <button onClick={() => { setState(state + 1) }}>State Increment</button>
            <button onClick={() => { ref.current = ref.current + 1 }}>Ref Increment</button>
        </>
    )
}