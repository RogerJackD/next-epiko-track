import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogHeader } from './ui/dialog'

export default function TaskDialog() {
  return (
    <Dialog>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle> Editar Tarea</DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
