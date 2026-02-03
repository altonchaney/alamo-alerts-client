import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("api/posts/:market", "routes/api.posts.$market.ts"),
  route(":location", "routes/$location.tsx"),
] satisfies RouteConfig;
