import { useState, useEffect, useCallback } from "react";
// export default function UseEffect() {
//     const [names, setNames] = useState([]);

//     const getList = useCallback(async () => {
//         try {
//             const response = await fetch(
//                 "https://animechan.vercel.app/api/available/anime"
//             );
//             const res = await response.json();
//             const namesArray = res.map((val, index) => {
//                 return (
//                     <option
//                         key={index}

//                     >
//                         {val}
//                     </option>
//                 );
//             });
//             setNames(namesArray);
//         } catch (error) {
//             console.log(error)
//         }
//     })
//     useEffect(() => {
//         getList();
//     }, []);

//     const [name, setName] = useState("");
//     const [Quote, setQuote] = useState("Select Name of Anime");
//     useEffect(() => {
//         fetchQuote();
//     }, [name])
//     const fetchQuote = useCallback(async () => {
//         if (name !== "") {
//             try {
//                 const response = await fetch(`https://animechan.vercel.app/api/random/anime?title=${name}`)
//                 const res = await response.json();
//                 setQuote(res);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         else {
//             // console.log("")
//             setQuote("Select Anime Name")
//         }
//     }, [name]);
//     return (
//         <div>
//             <h1>Anime Quotes</h1>
//             <select onChange={(e) => {
//                 setName(e.target.value);
//             }}><option>Select Name</option>{names}</select>
//             <p><cite>{Quote ? Quote.quote : ""}</cite>~{Quote ? Quote.character : ""}</p>
//             <button onClick={fetchQuote}>Change</button>
//         </div>
//     );
// }

export default function UseEffect() {
    // useEffect()
    const [url, setURL] = useState("");
    const fetchURL = useCallback(async () => {
        try {
            const res = await fetch("https://picsum.photos/500")
            const result = await res.blob()
            setURL(URL.createObjectURL(result))
        }
        catch (e) {
            console.log(e)
        }
    })
    useEffect(() => {
        console.log("hello")
        fetchURL()
    }, [])
    return (
        <>
            <img src={url} alt="image" />
            <button onClick={fetchURL} >Next</button>
        </>
    )
}