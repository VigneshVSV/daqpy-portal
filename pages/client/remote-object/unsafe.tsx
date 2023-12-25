'use client'
// Internal & 3rd party functional libraries
import { useRouter } from "next/navigation";
// Custom functional libraries
// Internal & 3rd party component libraries
// Custom component libraries 
import { UnsafeClient } from "@/app/builtins/remote-object-client/view";


const Unsafe = () => {
    const router = useRouter()
    return(
        <UnsafeClient setGlobalLocation={router.push} />
    )
}

export default Unsafe;