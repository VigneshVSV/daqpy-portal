import { globalAppState } from "@/app/builtins/app-state"
import { DashboardView } from "@/app/builtins/dashboard/view"
import NoSSR from '@/app/utils/no-ssr'


const Dashboard = () => {
    return (
        <NoSSR>
            <DashboardView globalState={globalAppState} />
        </NoSSR>
    )
}

export default Dashboard