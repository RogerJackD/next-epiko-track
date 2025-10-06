import { Building2, Laptop, Settings, TrendingUp, Users } from 'lucide-react'
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'


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
    </Sidebar>

  ) 
}
