// import React, { useState, useContext } from 'react';
// import { SIGNUP } from '../../utils/apiPaths';
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function SignUp(){
//   const { setUser, setToken } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [name,setName] = useState('');
//   const [email,setEmail] = useState('');
//   const [password,setPassword] = useState('');
//   const [avatar, setAvatar] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState('');

//   async function handleSubmit(e){
//     e.preventDefault();
//     setLoading(true);
//     setErr('');
//     try {
//       const form = new FormData();
//       form.append('name', name);
//       form.append('email', email);
//       form.append('password', password);
//       if (avatar) form.append('avatar', avatar);

//       const res = await fetch(SIGNUP, { method: 'POST', body: form });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.msg || 'Signup failed');

//       setToken(data.token);
//       setUser(data.user);
//       navigate('/dashboard');
//     } catch(err){
//       setErr(err.message);
//     } finally { setLoading(false); }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-semibold mb-4">Create account</h2>
//         {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
//         <input required className="w-full mb-3 p-2 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
//         <input required className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
//         <input required className="w-full mb-3 p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
//         <label className="block mb-3">
//           <span className="text-sm">Profile photo (optional)</span>
//           <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} className="mt-2" />
//         </label>
//         <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">
//           {loading ? 'Signing up...' : 'Sign up'}
//         </button>
//       </form>
//     </div>
//   );
// }
