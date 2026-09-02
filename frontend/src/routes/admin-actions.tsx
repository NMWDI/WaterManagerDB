import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminActions } from "@/views/AdminActions";
import { ProtectedRoute } from "@/ProtectedRoute";
import { booleanParam, pageParam, routeSearchHydrator } from "@/utils";

const searchSchema = z.object({
  ose_acknowledged: booleanParam(false),
  au_page: pageParam(0, 0),
  au_pageSize: pageParam(10, 10),
});

export const Route = createFileRoute("/admin-actions")({
  validateSearch: searchSchema,
  beforeLoad: ({ search, location }) =>
    routeSearchHydrator(location.pathname, search, location.searchStr),
  component: () => (
    <ProtectedRoute requiredScopes={["admin"]}>
      <AdminActions />
    </ProtectedRoute>
  ),
});
