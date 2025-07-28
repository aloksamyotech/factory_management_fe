"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { postApi } from "@/common/api";
import { urls } from "@/common/url";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try{      
      const res = await postApi(`${urls?.endpoints?.employee.employee}/login`, {email, password}, {withCredentials: true})
      localStorage.setItem('jwt', res?.data?.token)

      if(res?.success){
      setTimeout(()=>{
        router.push("/");
        setTimeout(()=>{
          window.location.reload()
        }, 2500);
      }, 1000);
        }
    }
    catch(error){
      toast.error("Error Login");
    }finally{
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        value={email}
        handleChange={e=> setEmail(e.target.value)}
        required
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        value={password}
        handleChange={e=> setPassword(e.target.value)}
        required
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
        
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          {loading ? (
            <>
            Signing In...
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            </>
          ) : ( "Sign In")
          }
        </button>
      </div>
    </form>
  );
}
