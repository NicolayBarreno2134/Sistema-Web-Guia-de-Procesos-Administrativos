
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'


const Profile = () => {
    const [administrador, setAdministrador] = useState(() => {
        try { return JSON.parse(localStorage.getItem('administrador') || '{}') } catch { return {} }
    })
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }

    useEffect(() => {
        axios.get(`${apiUrl}/perfil`, { headers })
            .then(({ data }) => {
                setAdministrador(data)
                localStorage.setItem('administrador', JSON.stringify(data))
            })
            .catch((error) => toast.error(error.response?.data?.msg || 'No se pudo cargar el perfil'))
    }, [])

    const guardarPerfil = async (datos) => {
        try {
            const { data } = await axios.put(`${apiUrl}/perfil`, datos, { headers })
            setAdministrador(data.administrador)
            localStorage.setItem('administrador', JSON.stringify(data.administrador))
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response?.data?.msg || 'No se pudo actualizar el perfil')
        }
    }

    const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    
    return (
        <>

            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F4E5F 0%, #183D4A 60%, #112C36 100%)' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white" style={{ transform: 'translate(30%, -30%)' }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white" style={{ transform: 'translate(-20%, 20%)' }} />
                </div>
                <div className="relative p-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Información de la cuenta</h1>
                        <p className="mt-0.5 text-md text-[#9EC5D0]">Este módulo te permite gestionar el perfil del usuario</p>
                    </div>
                        <p className="mt-0.5 text-md text-[#9EC5D0]">{fecha}</p>
                </div>
            </div>




                <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap my-4'>

                
                {/* Fomrulario perfil */}
                <div className='w-full md:w-1/2'>
                    <FormProfile key={administrador.email || 'perfil'} administrador={administrador} onSave={guardarPerfil} />
                </div>


                <div className='w-full md:w-1/2'>

                {/* Card para mostrar el perfil y formulario para cambiar la contraseña */}
                    <CardProfile administrador={administrador} />
                    <CardPassword />
                
                </div>
            </div>
        </>

    )
}

export default Profile
