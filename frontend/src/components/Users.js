import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API;

export const Users = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [editing, setEditing] = useState(false)
    const [id, setId] = useState('')


    const [users, setUsers] = useState([])
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
          const res = await fetch(`${API}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          });
          await res.json();
        } else {
          const res = await fetch(`${API}/users/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          });
          const data = await res.json();
          console.log(data);
          setEditing(false);
          setId("");
        }
        await getUsers();
    
        setName("");
        setEmail("");
        setPassword("");
      };

    const getUsers = async () => {
        const res = await fetch(`${API}/users`);
        const data = await res.json();
        setUsers(data)
    }

    useEffect(() => {
        getUsers();
    }, [])

    const editUser = async (id) => {
        const res = await fetch(`${API}/user/${id}`);
            const data = await res.json();
            
            setEditing(true);
            setId(id);

            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
    }

    const deleteUser = async (id) => {
        const userResponse = window.confirm('¿Esta seguro que quiere eliminar el contacto?')
        if (userResponse) {
            const res = await fetch(`${API}/users/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            console.log(data);
            await getUsers();
        }
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                      <input 
                            type="text" 
                            onChange={e => setName(e.target.value)} 
                            value={name}
                            className="form-control"
                            placeholder="Name"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                      <input 
                            type="email" 
                            onChange={e => setEmail(e.target.value)} 
                            value={email}
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                      <input 
                            type="password" 
                            onChange={e => setPassword(e.target.value)} 
                            value={password}
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <button className="btn btn-primary btn-block">
                    {editing ? 'Actualizar': 'Crear'}
                    </button>
                </form>
            </div>
            <div className="col-md-6">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Contraseña</th>
                        <th>Operación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map( user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>
                                <button 
                                className="btn btn-secondary btn-sm btn-block"
                                onClick={() => editUser(user._id)}
                                >
                                    Editar
                                </button>
                                <button 
                                className="btn btn-danger btn-sm btn-block"
                                onClick={() => deleteUser(user._id)}
                                >
                                    Borrar
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}