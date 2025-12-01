"use client";

import supabase from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";

const Login = () => {
  return <Auth supabaseClient={supabase} appearance={{ theme: "default" }} />;
};

export default Login;
