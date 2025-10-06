import { Building2, Laptop, LogOut, Settings, TrendingUp, Users } from 'lucide-react'
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Button } from './ui/button'

const areas = [
  {
    title: "Marketing",
    icon: TrendingUp,
    id: "marketing",
  },
  {
    title: "Administración",
    icon: Building2,
    id: "administration",
  },
  {
    title: "Tecnología",
    icon: Laptop,
    id: "technology",
  },
  {
    title: "Recursos Humanos",
    icon: Users,
    id: "hr",
  },
]

interface AppSidebarProps {
  activeArea: string
  onAreaChange: (area: string) => void
}

export default function AppSidebar({activeArea, onAreaChange}: AppSidebarProps) {



  return (
    <Sidebar>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className='text-lg font-semibold'>Areas de la empresa</SidebarGroupLabel> 
                <SidebarGroupContent>
                    <SidebarMenu>
                        {areas.map((area) => (
                            <SidebarMenuItem key={area.id}>
                                <SidebarMenuButton
                                    onClick={() => onAreaChange(area.id)}
                                    isActive={activeArea === area.id}
                                    className='w-full justify-start'
                                >
                                    <area.icon className='h-4 w-4'/>
                                    <span>{area.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel className='text-lg font-semibold'>Administracion</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => onAreaChange("admin")}
                                isActive={activeArea === "admin"}
                                className="w-full justify-start"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Panel de Admin</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">administrador</p>
              <p className="text-xs text-muted-foreground truncate">admin</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
            <LogOut className="h-3 w-3" />
            Cerrar Sesión
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>

  ) 
}
