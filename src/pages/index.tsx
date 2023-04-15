import Logo from "../assets/logo";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import authService from "../modules/users/services/auth";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../modules/users/Login"), {
  ssr: false,
})

export default App;

