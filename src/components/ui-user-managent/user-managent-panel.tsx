'use client'

import { userService } from '@/services/user-service'
import { User } from '@/types/user'
import React, { useEffect, useState } from 'react'
import UsersTable from './user-managent-table'
import AdminHeader from './user-managent-header'
import CreateUserModal from './create-user-modal'
import EditUserModal from './edit-user-modal'
import { toast } from 'sonner'

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  
  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Función para cargar usuarios
  const fetchUsers = async () => {
    try {
      const dataUser = await userService.getAllUsers()
      console.log(dataUser)
      setUsers(dataUser)
      setFilteredUsers(dataUser)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    let filtered = [...users]

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role?.name === roleFilter)
    }

    // Filtro de área
    if (areaFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.area?.name.toLowerCase() === areaFilter.toLowerCase()
      )
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, areaFilter, users])

  const handleSearch = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterRole = (role: string) => {
    setRoleFilter(role)
  }

  const handleFilterArea = (area: string) => {
    setAreaFilter(area)
  }

  const handleAddUser = () => {
    setIsCreateModalOpen(true)
  }

  const handleUserCreated = () => {
    fetchUsers()
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleUserUpdated = () => {
    fetchUsers()
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.updateUser(
        { status: !user.status },
        user.id
      )

      toast.success(
        !user.status ? '¡Usuario activado!' : '¡Usuario desactivado!',
        {
          description: !user.status 
            ? `${user.firstName} ${user.lastName} ha sido activado` 
            : `${user.firstName} ${user.lastName} ha sido desactivado`
        }
      )

      fetchUsers()
    } catch (error) {
      toast.error('Error al cambiar el estado', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }


  return (
    <div className='p-6 bg-background min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-card rounded-lg shadow-sm p-6'>
          <AdminHeader
            onSearch={handleSearch}
            onFilterRole={handleFilterRole}
            onFilterArea={handleFilterArea}
            onAddUser={handleAddUser}
            totalUsers={filteredUsers.length}
          />
          <UsersTable 
            users={filteredUsers}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Modal de creación */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleUserCreated}
      />

      {/* Modal de edición */}
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleUserUpdated}
        user={selectedUser}
      />
    </div>
  )
}