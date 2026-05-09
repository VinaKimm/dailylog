import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
