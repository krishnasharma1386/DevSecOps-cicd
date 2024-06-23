import { useState, useRef, useEffect } from "react"

export default function UseState() {
    const [count, setCount] = useState(0)
    const ren = useRef(0)
    useEffect(() => {
        ren.current = ren.current + 1
    }, [count])
    return (
        <>
            <h1>Times Rendered: {ren.current}</h1>
            <h1>Count: {count}</h1>
            <button onClick={() => { setCount(count + 1) }}>Click</button>
        </>
    )
}