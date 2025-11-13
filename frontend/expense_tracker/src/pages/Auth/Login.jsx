// import React, { useState, useContext } from 'react';
// import { LOGIN } from '../../utils/apiPaths';
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function Login(){
//   const { setUser, setToken } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email,setEmail] = useState('');
//   const [password,setPassword] = useState('');
//   const [err,setErr] = useState('');
//   const [loading,setLoading] = useState(false);

//   async function submit(e){
//     e.preventDefault();
//     setLoading(true);
//     setErr('');
//     try {
//       const res = await fetch(LOGIN, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
//       const data = await res.json();
//       if(!res.ok) throw new Error(data.msg || 'Login failed');

//       setToken(data.token);
//       setUser(data.user);
//       navigate('/dashboard');
//     } catch(err){
//       setErr(err.message);
//     } finally { setLoading(false); }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <form onSubmit={submit} className="bg-white w-full max-w-md p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-semibold mb-4">Login</h2>
//         {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
//         <input required className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
//         <input required className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
//         <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }
