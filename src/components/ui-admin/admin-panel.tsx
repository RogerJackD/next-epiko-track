'use client'

import { userService } from '@/services/user-service'
import { User } from '@/types/user'
import React, { useEffect, useState } from 'react'
import UsersTable from './users-table'


export default function AdminPanel() {

  const [users, setUsers] = useState<User[]>()


  useEffect(() => {
  
    const fetchUsers = async () => {
      const dataUser = await userService.getUsers()
      console.log(dataUser)
      setUsers(dataUser)
    }

    fetchUsers()

    
  }, [])
  

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <UsersTable users={users} />
    </div>
  )
}
