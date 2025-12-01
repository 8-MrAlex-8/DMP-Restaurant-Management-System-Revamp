"use client";

import supabase from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
};

export default Login;
