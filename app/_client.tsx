// ("use client");

// import { useEffect, useState } from "react";
// import supabase from "@/lib/supabaseClient";

// const ClientExample = () => {
//   const [list, setList] = useState([]);

//   useEffect(() => {
//     supabase
//       .from("profiles")
//       .select("*")
//       .then(({ data: any }) => {
//         setList(data ?? []);
//       });
//   }, []);

//   return <pre>{JSON.stringify(list, null, 2)}</pre>;
// };

// export default ClientExample;
