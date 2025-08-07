import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/common/api";
import { urls } from "@/common/url";
import logo from "@/assets/logos/main.svg";
import Image from "next/image";

export function Logo() {
  const [logoUrl, setLogoUrl] = useState('');

  const getData = useCallback(async () => {
    try {
      const url = `${urls?.endpoints?.employee?.logo}`;
      const response = await getApi(url);
      const path = response?.data?.data?.url;
      
      if (path!=='') {
        // setLogoUrl(`http://localhost:3001/${path}`);
        setLogoUrl(`https://factory.samyotech.in/${path}`);
      }
    } catch (err) {
      console.error("Failed to fetch logo:", err);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="h-full">
      <Image
        src={logoUrl||logo}
        objectFit="contain"
        fill
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
        unoptimized
      />
    </div>
  );
}
