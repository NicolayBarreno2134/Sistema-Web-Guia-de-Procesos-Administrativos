
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const CardPassword = () => {
    const [loading, setLoading] = useState(false)
    const cambiarPassword = async (event) => {
        event.preventDefault()
        const formulario = event.currentTarget
        const form = new FormData(formulario)
        const passwordActual = form.get('passwordActual')
        const passwordNueva = form.get('passwordNueva')
        if (passwordNueva !== form.get('confirmarPassword')) {
            toast.error('La nueva contraseña y su confirmación no coinciden')
            return
        }
        setLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
            const { data } = await axios.put(`${apiUrl}/perfil/password`, { passwordActual, passwordNueva }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            toast.success(data.msg)
            formulario.reset()
        } catch (error) {
            toast.error(error.response?.data?.msg || 'No se pudo cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6">
                <h2 className='font-black text-2xl mb-4 text-[#193e4b9b]'>Cambiar contraseña</h2>
                
                {/* Formulario */}
                <form onSubmit={cambiarPassword}>

                    
                    
                    {/* Campo contraseña actual */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Contraseña actual</label>
                        <input name="passwordActual" type="password" required placeholder="Ingresa tu contraseña actual"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5" />
                    </div>

                    
                    {/* Campo contraseña nueva */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                        <input name="passwordNueva" type="password" minLength={8} required placeholder="Ingresa la nueva contraseña" className="block w-full rounded-md border
                            border-gray-300 py-1 px-2 text-gray-500 mb-5" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Confirmar nueva contraseña</label>
                        <input name="confirmarPassword" type="password" minLength={8} required placeholder="Confirma la nueva contraseña" className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5" />
                    </div>



                    {/* Botón para actualizar la contraseña */}
                    <input disabled={loading}
                        type="submit"
                        className='bg-gray-800 p-2 mt-5 text-slate-300 font-bold rounded-lg 
                        hover:bg-gray-600 cursor-pointer transition-all'
                        value={loading ? 'Actualizando...' : 'Cambiar contraseña'} />

                </form>
            </div>

        </>
    )
}

export default CardPassword
