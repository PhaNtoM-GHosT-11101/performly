// Prevent static caching — dashboard requires a live authenticated session
export const dynamic = "force-dynamic";

import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return <DashboardClient />;
}
