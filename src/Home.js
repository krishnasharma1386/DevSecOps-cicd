import { useState } from 'react';

function Label({ id, data, children }) {
    return (
        <label>{data} {children}</label>
    );
}

function handleClick(setView, data) {
    var view = [
        <span><p><b>Name: </b></p><p>{data.name}</p></span>,

        <span><p><b>Phone: </b></p>
            <p>{data.phone}</p></span>,

        <span><p><b>Email: </b></p>
            <p>{data.email}</p></span>,

        <span><p><b>Gender: </b></p>
            <p>{data.gender}</p></span>,

    ];
    setView(view)
}

function Form({ setView }) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    var [male, setMale] = useState(false)
    var [female, setFemale] = useState(false)

    return (
        <form>
            <Label
                id="Name"
                data="Enter Your Name: "
                children={<input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>}
            />
            <br />
            <br />
            <Label
                id="phone"
                data="Enter Phone Number: "
                children={<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}></input>}
            />
            <br />
            <br />
            <Label
                id="email"
                data="Enter Email ID: "
                children={<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>}
            />
            <br />
            <br />
            <Label
                id="gender"
                data="Gender: "
                children={
                    <>
                        <Label
                            id="gender"
                            data="Male "
                            children={<input type="radio" name="gender" checked={male} onChange={(e) => { setMale(true) }} value="Male"></input>}
                        />
                        <Label
                            id="gender"
                            data="Female "
                            children={<input type="radio" name='gender' checked={female} onChange={(e) => { setFemale(true) }}></input>}
                        />
                    </>
                }
            />
            <input type="submit" onClick={(e) => {
                e.preventDefault();
                var data = {
                    name: name,
                    phone: phone,
                    email: email,
                    gender: male ? "Male" : "Female"
                }
                handleClick(setView, data)
            }}></input>
        </form>
    );
}

export default function Home() {
    const [view, setView] = useState("");
    return (
        <>      
            <Form
            setView={setView}
        />
            <div id="display">
                {view}
            </div></>
    )
}
