import { redirect } from "react-router";
import { DEFAULT_MARKET } from "~/config/markets";

export function loader() {
  return redirect(`/${DEFAULT_MARKET}`);
}
