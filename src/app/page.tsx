import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect to dashboard as the main entry point
  redirect("/dashboard");
}
