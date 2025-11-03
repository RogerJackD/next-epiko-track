import { User } from '@/types/user'
import React from 'react'

interface UsersTableProps {
  users?: User[]
}


export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div>
      {users?.map(user => (
        <div key={user.id} className='mb-2 p-2 border-b'>
          <p className='font-semibold'>{user.firstName} {user.lastName}</p>
          <p className='text-sm text-gray-600'>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
