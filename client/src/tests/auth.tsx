import { useState } from "react"
import { useMutation } from "react-query"
import { api } from "../utils/trpc"

export default function AuthPage() {
    const createUser = useMutation(["createUser"], api.user.createUser.mutate)
    const loginUser = useMutation(["loginUser"], api.user.loginUser.mutate)
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <div>
            <h1>Auth</h1>
            <div>
                <h3>Register user</h3>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    createUser.mutate({ name, age: Number(age), email, password })
                }}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">Create user</button>
                </form>
            </div>
            <div>
                <h3>Log in user</h3>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    loginUser.mutate({ email, password })
                }}>                    
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">Login</button>
                </form>
            </div>

        </div>
    )
}