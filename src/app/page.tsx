import { redirect } from "next/navigation";


export default async function Page() {
  redirect('/dashboard/overview');
  // if (!userId) {
  //   return redirect('/auth/sign-in');
  // } else {
  //   redirect('/dashboard/overview');
  // }
}
