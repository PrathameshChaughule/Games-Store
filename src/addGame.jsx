import { supabase } from "./supabaseClient/supabaseClient";


export const addGame = async () => {
    const { data, error } = await supabase.from("requests").insert([]).select();

    if (error) throw error;
    return data;
};
