import dynamic from "next/dynamic";

const App = dynamic(() => import("../modules/users/Login"), {
  ssr: false,
})

export default App;

