import { useReducer } from "react"
function reducer(state, action) {
    switch (action.type) {
        case "Increment":
            return { count: state.count += 1, bool: state.bool }
        case "Decrement":
            return { count: state.count -= 1, bool: state.bool }
        case "toggleText":
            return { count: state.count, bool: !state.bool }
        default:
            return state;
    }
}
export default function UseReducer() {
    const [state, dispatch] = useReducer(reducer, { count: 0, bool: false })
    return (
        <>
            <h1>Count: {state.count}</h1>
            <button onClick={() => { dispatch({ type: "Increment" }) }} >Increment</button>
            <button onClick={() => { dispatch({ type: "Decrement" }) }} >Decrement</button>
            {state.bool ? <h1>HI I AM REACT REDUCER HOOK</h1> : null}
            <button onClick={() => { dispatch({ type: "toggleText" }) }} >ToggleText</button>
        </>
    )
}