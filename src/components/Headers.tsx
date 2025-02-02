import Link from "next/link"

export default function Headers() {
    const NavLinks =[
        {
            name:"Home",
            href:"/"
        },
        {
            name : "Sign in",
            href:"/sign-in"
        }
    ]
  return (
    <nav className="h-20 flex justify-around items-center w-full">
        <ul className="flex justify-around items-center w-full m-5 text-xl">
             {NavLinks.map((link,index)=>(
                 <li key={index}>
                     <Link href={link.href}>{link.name}</Link>
                 </li>
             ))}
        </ul>
    </nav>
  )
}
