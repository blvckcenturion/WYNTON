import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("../../modules/dashboard/Dashboard"), {
    ssr: false,
})

export default DashboardPage

