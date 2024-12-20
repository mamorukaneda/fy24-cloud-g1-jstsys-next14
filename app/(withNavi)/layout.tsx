import "@aws-amplify/ui-react/styles.css";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function withNaviLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <SidebarProvider>
     <AppSidebar />
     <SidebarTrigger className="ml-3 mt-3" />
     <div className="flex-1 overflow-auto p-8 pt-16">{children}</div>
     </SidebarProvider>
  );
}