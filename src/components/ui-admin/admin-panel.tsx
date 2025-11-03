'use client'

import { userService } from '@/services/user-service'
import { User } from '@/types/user'
import React, { useEffect, useState } from 'react'
import UsersTable from './users-table'
import AdminHeader from './admin-header'

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      const dataUser = await userService.getUsers()
      console.log(dataUser)
      setUsers(dataUser)
      setFilteredUsers(dataUser)
    }

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
    console.log('Agregar nuevo usuario')
  }

  const handleExport = () => {
    console.log('Exportar usuarios')
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
            onExport={handleExport}
            totalUsers={filteredUsers.length}
          />
          <UsersTable users={filteredUsers} />
        </div>
      </div>
    </div>
  )
}